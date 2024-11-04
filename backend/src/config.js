module.exports = {
   "mysql": {
      host: "localhost",
      user: "root",
      password: "",
      database: "hospital_management_db",
      port: 3306
   },
   "signedUrlExpireSeconds": 60 * 5,
   "ADMIN_EMAIL": "jaiminjoshi118@gmail.com",
   "secret": process.env.secret || "exyAU0cwm2weEqyG3Y3C",
   "refreshTokenSecret": process.env.refreshTokenSecret || "LdlyhvYRVNkD1wlpIfks",
   "port": 3000,
   "tokenLife": parseInt(process.env.tokenLife) || 90 * 86400,
   "refreshTokenLife": parseInt(process.env.refreshTokenLife) || 91 * 86400,
   "endpoint": process.env.endpoint || "http://localhost:8000",
   "stage": process.env.stage || "dev",
   "rootPath": process.env.rootPath || "https://v3.jobsquare.com",
   "apiEndpoint": process.env.apiEndpoint || "http://localhost:3000/",
   "officialCompanyname": "JobSquare Network Private Limited",
   "defaultTimezoneOffSet": -330,
   "encryptSecretKey": process.env.encryptSecretKey || "z6kZgb2meaIi9FZDpj9GVMlJYgi2FL2O",
   "adminContactNumber": process.env.adminContactNumber || 8690415675,
}