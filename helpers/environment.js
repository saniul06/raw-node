const environment = {}

environment.development = {
    port: 2000,
    envName: "dev",
    secretKey: 'wredgfdasdfsdfq',
    twilio: {
        fromPhone: '+12175744240',
        accountSid: 'AC530aaf735584483f811de672aed0c6a1',
        authToken: '50c6d7e7f017aa0900b7334abb3a1539'
    }
};

environment.production = {
    port: 4000,
    envName: "production",
    secretKey: 'iretkjldgf',
    twilio: {
        fromPhone: '+12175744240',
        accountSid: 'AC530aaf735584483f811de672aed0c6a1',
        authToken: '50c6d7e7f017aa0900b7334abb3a1539'
    }
};

const currentEnvironment = typeof (process.env.NODE_ENV === "string") ? process.env.NODE_ENV : "development";

// const environmentToExport = typeof (environment[currentEnvironment] === "object") ? environment[currentEnvironment] : "development";

const environmentToExport = currentEnvironment in environment ? environment[currentEnvironment] : environment["development"];

module.exports = environmentToExport