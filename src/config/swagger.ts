// src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Barchasb API",
      version: "1.0.0",
      description: "Barchasb Server API Documentation",
      contact: {
        name: "Barchasb Team",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // مسیر فایل‌های route شما
};

const specs = swaggerJsdoc(options);

export default (app: Application) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true }),
  );
  console.log("📚 Swagger docs available at /api-docs");
};

export { options as swaggerOptions, specs as swaggerSpecs };
