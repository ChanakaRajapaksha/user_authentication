const { PrismaClient } = require("@prisma/client");
const logger = require("../logger"); // Assume you're using a logger like Winston or Pino

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();

    const logData = {
        model: params.model,
        action: params.action,
        args: params.args, // Prisma's `args` property will automatically contain the parameters
        duration: `${after - before}ms`,
    };

    logger.info(logData); // Log the object directly
    return result;
});

module.exports = prisma;
