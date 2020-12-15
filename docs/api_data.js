define({ "api": [
  {
    "type": "post",
    "url": "/api/grid",
    "title": "",
    "group": "API_KIYOSE",
    "name": "GetKigoAsGrid",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "current",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "rowCount",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "searchYomi",
            "description": "<p>&quot;true&quot; as string or something else, not boolean.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "searchMode",
            "description": "<p>&quot;startsWith&quot;, &quot;endsWith&quot; or something else. Default behavior is &quot;include&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "searchPhrase",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Obeject[]",
            "optional": false,
            "field": "seasons",
            "description": "<p>It will filter only checked seasons.</p>"
          },
          {
            "group": "Parameter",
            "type": "Obeject[]",
            "optional": false,
            "field": "categories",
            "description": "<p>It will filter only checked categories.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "error",
            "description": "<p>Unable to access database.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "total",
            "description": "<p>Total row count of the DB file.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "rows",
            "description": "<p>Rows body.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/api.js",
    "groupTitle": "API_KIYOSE"
  },
  {
    "type": "get",
    "url": "/api/kigo",
    "title": "",
    "group": "API_KIYOSE",
    "name": "GetKigoIndex",
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "errror",
            "description": "<p>Unable to access database.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "seasons",
            "description": "<p>Index of seasons.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "categories",
            "description": "<p>Index of categories.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/api.js",
    "groupTitle": "API_KIYOSE"
  },
  {
    "type": "post",
    "url": "/api/analyse",
    "title": "",
    "group": "API_POEM",
    "name": "AnalysePhrase",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sentence",
            "description": "<p>Phrase to be analysed.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "error",
            "description": "<p>Unable to build tokenizer.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "info",
            "description": "<p>Array of token information.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/api.js",
    "groupTitle": "API_POEM"
  },
  {
    "type": "put",
    "url": "/api/find",
    "title": "",
    "group": "API_POEM",
    "name": "FindPhrasesComingAfterPrefix",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pref",
            "description": "<p>Prefix.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "expec",
            "description": "<p>Expected length.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "error",
            "description": "<p>Unable to access database.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body",
            "description": "<p>Generated phrase.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/api.js",
    "groupTitle": "API_POEM"
  },
  {
    "type": "get",
    "url": "/api/vocab",
    "title": "",
    "group": "API_POEM",
    "name": "GetVocabulary",
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "error",
            "description": "<p>Unable to access database.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "vocab",
            "description": "<p>Vocabulary.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/api.js",
    "groupTitle": "API_POEM"
  },
  {
    "type": "post",
    "url": "/api/poem",
    "title": "",
    "group": "API_POEM",
    "name": "PoemCreation",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "keyphrase.phraselast",
            "description": "<p>Last term of keyphrase.</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "keyphrase.phrase",
            "description": "<p>Phrase body.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "keyphrase.mora",
            "description": "<p>Mora count of keyphrase</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "info",
            "description": "<p>Poem body.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/api.js",
    "groupTitle": "API_POEM"
  },
  {
    "type": "put",
    "url": "/api/random",
    "title": "",
    "group": "API_POEM",
    "name": "RandomPharaseGeneration",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "expec",
            "description": "<p>Expected length.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "error",
            "description": "<p>Unable to access database.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body",
            "description": "<p>Generated phrase.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/api.js",
    "groupTitle": "API_POEM"
  },
  {
    "type": "post",
    "url": "/webhooks/upload",
    "title": "",
    "group": "WEBHOOK",
    "name": "Cloudinary_Upload",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Message to display.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "error",
            "description": "<p>Response from Cloudinary API.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": "<p>Response from Cloudinary API.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/routes/webhooks.js",
    "groupTitle": "WEBHOOK"
  }
] });
