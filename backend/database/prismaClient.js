const { PrismaClient } = require("@prisma/client");
const logger = require("../logger"); 

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();

    if (params.args && params.args.data && params.args.data.refreshToken) {
        params.args.data.refreshToken = "REDACTED"; 
    }

    const logData = {
        model: params.model,
        action: params.action,
        
        duration: `${after - before}ms`,
    };

    logger.info(logData); 
    return result;
});

module.exports = prisma;
