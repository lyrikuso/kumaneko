const express = require("express")
const consola = require("consola")
const { Nuxt, Builder }  = require("nuxt")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const moesif = require("moesif-express")
const rateLimit = require("express-rate-limit")
const Redis = require("ioredis")
const RedisStore = require("rate-limit-redis")
const session = require("express-session")
const cors = require("cors")
const helmet = require("helmet")


const app = express()
const host = process.env.HOST || "127.0.0.1"
const port = process.env.PORT || 3000

app.set("port", port)
app.set("trust proxy", 1)  // trust first proxy

//  Import  and  Set  Nuxt.js  options
let config = require("../nuxt.config.js")
config.dev = !(process.env.NODE_ENV === "production")

// Sessionstore
let memorystore;

if (process.env.NODE_ENV == "production") {
    const MemcachedStore = require("connect-memjs")(session);
    memorystore = new MemcachedStore({
        servers: [process.env.MEMCACHEDCLOUD_SERVERS],
        username: process.env.MEMCACHEDCLOUD_USERNAME,
        password: process.env.MEMCACHEDCLOUD_PASSWORD,
        remove: true
    });
} else {
    const MemoryStore = require("memorystore")(session);
    memorystore = new MemoryStore({
        checkPeriod: 1000 * 60 * 5 // prune every 6 min
    });
}

// middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    store: memorystore,
    secret: process.env.SESSION_SECRET || "kumaneko",
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        httpOnly: config.dev, // true on development
        maxAge: 1000 * 60 * 25 // 25 min window
    }
}))
app.use(cors({ origin: true }))
app.use(helmet())

if (!config.dev) {

    // moesif
    const moesifMiddleware = moesif({
        applicationId: process.env.MOESIF_APPLICATION_ID
    })
    moesifMiddleware.startCaptureOutgoing()
    app.use(moesifMiddleware)

    // rate-limiter
    const rateLimiter = rateLimit({
        store: new RedisStore({
            expiry: 3 * 60 * 1000, // 3 min window
            client: new Redis(process.env.REDIS_URL)
        }),
        statusCode: 429,
        max: 1000
    })
    app.use(rateLimiter)
}

async function start() {
    // Init Nuxt.js
    const nuxt = new Nuxt(config)

    // Build only in dev mode
    if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
            .catch(error => {
                console.error(error);
                process.exit(1);
            })
    }

    // Routing
    app.use("/api", require("./routes/api"))
    app.use("/webhooks", require("./routes/webhooks"))

    // Give nuxt middleware to express
    app.use(nuxt.render)

    // Listen the server
    app.listen(port, host)
    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
    })
}

start()
