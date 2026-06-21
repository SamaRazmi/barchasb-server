export const swaggerAdminOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Barchasb Admin API",
      version: "0.0.1",
      description: "API documentation for Barchasb ADMIN backend",
    },
    components: {
      securitySchemes: {
        AdminAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        SuperAdmin: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ AdminAuth: [], SuperAdmin: [] }],
  },
  apis: ["./src/routes/admin/**/*.ts"],
};