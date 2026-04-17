const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};

// Example Schemas for our routes
const schemas = {
  alertSchema: z.object({
    body: z.object({
      message: z.string().min(5).max(250),
      severity: z.enum(['low', 'medium', 'high', 'critical'])
    })
  }),
  routeSchema: z.object({
    body: z.object({
      start: z.string().min(2),
      end: z.string().min(2)
    })
  })
};

module.exports = { validate, schemas };
