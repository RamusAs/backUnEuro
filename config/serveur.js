const express = require("express")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const cors = require("cors")

const app = express()

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
)

app.use(express.static("uploads"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:8082",
  "http://172.17.67.48:8082",
  "http://172.17.67.48:8081",
]

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true)
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin."
        return callback(new Error(msg), false)
      }
      return callback(null, true)
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

module.exports = {
  server: app,
}
