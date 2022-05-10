const Config = require("./config");
const express = require("express");
const path = require("path");
const fs = require("fs");
const Util = require("./util");
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const http = require("http");
const https = require("https");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads/"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

const session = require("express-session");

var privateKey = fs.readFileSync(__dirname + "/../ssl/private.key");
var certificate = fs.readFileSync(__dirname + "/../ssl/certificate.crt");
var credentials = { key: privateKey, cert: certificate };

var cors = require("cors");

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    maxAge: "864000000",
    allowedHeaders: "*",
};

const MongoDBHelper = require("../Helper/mongodbHelper");
const { json } = require("express");

module.exports = class App {
    constructor() {
        //Load Util
        this.util = new Util(this);
        //Load Config
        this.config = new Config();
        this.app = express();
        this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
        this.app.use(bodyParser.json({ limit: "50mb" }));
        this.app.use(cors(corsOptions));
        this.app.use(
            session({
                name: "ssid",
                secret: this.config.identityKey,
                saveUninitialized: false,
                resave: false,
                cookie: {
                    maxAge: 30 * 60 * 1000,
                },
            })
        );

        this.app.engine("html", require("ejs").renderFile);
        this.server = http.createServer(this.app);
        this.httpsServer = https.createServer(credentials, this.app);
        this.io = new Server();
        this.io.attach(this.server);
        this.io.attach(this.httpsServer);
        // this.auth = (req, res, next) => {
        //     if (req.session.username) {
        //         next();
        //     } else {
        //         return res.redirect("/adminLogin");
        //     }
        // };

        this.dbHelper = new MongoDBHelper({
            uri: this.config.mongoDBuri,
            databaseName: this.config.databaseName,
            dataCollectionName: this.config.dataCollectionName,
        });
        this.adminHelper = new MongoDBHelper({
            uri: this.config.mongoDBuri,
            databaseName: this.config.databaseName,
            dataCollectionName: this.config.adminCollectionName,
        });
        this.reportHelper = new MongoDBHelper({
            uri: this.config.mongoDBuri,
            databaseName: this.config.databaseName,
            dataCollectionName: this.config.reportCollectionName,
        });
        this.loginHelper = new MongoDBHelper({
            uri: this.config.mongoDBuri,
            databaseName: this.config.databaseName,
            dataCollectionName: this.config.loginCollectionName,
        });
        this.followingHelper = new MongoDBHelper({
            uri: this.config.mongoDBuri,
            databaseName: this.config.databaseName,
            dataCollectionName: this.config.followCollectionName,
        });
        this.chatRoomHelper = new MongoDBHelper({
            uri: this.config.mongoDBuri,
            databaseName: this.config.databaseName,
            dataCollectionName: this.config.chatRoomCollectionName,
        });

        this.msgHelper = new MongoDBHelper({
            uri: this.config.mongoDBuri,
            databaseName: this.config.databaseName,
            dataCollectionName: this.config.msgCollectionName,
        });
        this.noteHelper = new MongoDBHelper({
            uri: this.config.mongoDBuri,
            databaseName: this.config.databaseName,
            dataCollectionName: this.config.noteCollectionName,
        });

        this.app.use(
            express.urlencoded({
                extended: true,
            })
        );
        this.app.use(express.json());

        //Route

        //Admin Login Page
        // this.app.get("/", (req, res) => {
        //     res.redirect("/home");
        // });
        // this.app.get("/adminLogin", async (req, res) => {
        //     if (req.session.user) {
        //         //already logged in
        //         return res.redirect("/home");
        //     }
        //     res.sendFile(`${path.join(__dirname, "../src/index.html")}`);
        // });

        // this.app.get("/adminLogout", this.auth, (req, res) => {
        //     req.session.destroy(() => {
        //         //session destroyed callback
        //     });
        //     res.redirect("/");
        // });

        // this.app.get("/details", this.auth, (req, res) => {
        //     console.log(req.query._id);
        //     //get job data by id
        //     this.dbHelper.getJobById(req.query._id).then((job) => {
        //         console.log(job);
        //     });
        // });

        // this.app.post("/adminLogin", (req, res) => {
        //     const { username, password } = req.body;

        //     //connect to dabase and check
        //     this.adminHelper.getUserByUsername(username).then((user) => {
        //         if (user.length > 0) {
        //             if (user[0].password === password) {
        //                 req.session.username = username;
        //                 res.redirect("/home");
        //             } else {
        //                 res.redirect("/adminLogin");
        //             }
        //         } else {
        //             res.redirect("/adminLogin");
        //         }
        //     });
        // });

        // this.app.get("/home", this.auth, async (req, res) => {
        //     var defaultAvatarBase64 = this.config.defaultAvatarBase64;
        //     //logged in page
        //     const username = req.session.username;
        //     const allJobData = await this.dbHelper.getAllJobData();
        //     let JobHtmlString;
        //     const processedData = Promise.all(
        //         allJobData.map(async (job) => {
        //             //get user data
        //             const user = await this.loginHelper.findOne({
        //                 _id: new ObjectId(job.AuthorID),
        //             });
        //             JobHtmlString = `<tr><td><img src="data:image/png;base64,${
        //                 user.avatar ? user.avatar : defaultAvatarBase64
        //             }" class="avatar">
        //                     <div style="flex-direction: column;"><a href="/details?_id=${
        //                         job._id
        //                     }">${job.Title}</a><p>${
        //                 user.username
        //             }</p></div></td><td style="display:none;"></td><td style="display:none;"></td></tr>`;
        //             return decodeURIComponent(JobHtmlString);
        //         })
        //     );
        //     res.render(path.join(__dirname, "../src/home.html"), {
        //         username: username,
        //         author: username,
        //         JobHtmlString: (await processedData).join(""),
        //     });
        // });

        // this.app.get("/login", async (req, res) => {
        //     const result = await this.loginHelper.findOne({
        //         email: req.headers["email"],
        //         password: req.headers["password"],
        //     });
        //     if (result) {
        //         //generate random token and save to database
        //         const token = this.util.generateToken(result.username);
        //         await this.loginHelper.findOneAndUpdate(
        //             {
        //                 username: result.username,
        //             },
        //             {
        //                 $set: {
        //                     UserToken: token,
        //                 },
        //             }
        //         );
        //         res.json({
        //             success: true,
        //             message: "Login Success",
        //             UserToken: token,
        //         });
        //     } else {
        //         res.json({
        //             success: false,
        //             message: "Login Failed",
        //         });
        //     }
        // });

        this.app.get("/favicon", async (req, res) => {
            res.sendFile(`${path.join(__dirname, "../src/favicon.ico")}`);
        });
        this.app.get("/defaultAvatar", async (req, res) => {
            res.sendFile(`${path.join(__dirname, "../src/avatar.png")}`);
        });
        this.app.get("/logo", async (req, res) => {
            res.sendFile(`${path.join(__dirname, "../src/logo.svg")}`);
        });
        this.app.get("/getJobAuthorEmail", async (req, res) => {
            if (!req.headers["author_id"]) {
                return res.json({
                    success: false,
                    message: "author_id is required",
                });
            }
            const result = await this.loginHelper.findOne({
                _id: new ObjectId(req.headers["author_id"]),
            });
            if (result) {
                res.json({
                    success: true,
                    message: "Get Author Email Success",
                    email: result.email,
                });
            } else {
                res.json({
                    success: false,
                    message: "Get Author Email Failed",
                });
            }
        });

        this.app.get("/register", async (req, res) => {
            const existing = await this.loginHelper.findOne({
                email: req.headers["email"],
            });
            if (existing) {
                res.json({
                    success: false,
                    message: "Email already exists",
                });
            } else {
                const result = await this.loginHelper.insert({
                    email: req.headers["email"],
                    password: req.headers["password"],
                    username: req.headers["username"],
                });
                if (result) {
                    //generate random token and save to database
                    const token = this.util.generateToken(result.username);
                    await this.loginHelper.findOneAndUpdate(
                        {
                            username: req.headers["username"],
                        },
                        {
                            $set: {
                                UserToken: token,
                            },
                        }
                    );
                    res.json({
                        success: true,
                        message: "Register Success",
                        UserToken: token,
                    });
                } else {
                    res.json({
                        success: false,
                        message: "Register Failed",
                    });
                }
            }
        });

        this.app.get("/addNote", async (req, res) => {
            if (!req.headers["usertoken"]) {
                return res.json({
                    success: false,
                    message: "UserToken is required",
                });
            }
            if (!req.headers["note"]) {
                return res.json({
                    success: false,
                    message: "Note is required",
                });
            }

            //get author name and id by userToken
            const author = await this.loginHelper.findOne(
                {
                    UserToken: req.headers["usertoken"],
                },
                { projection: { password: 0 } }
            );

            if (!req.headers["job_id"]) {
                //insert Note to database
                const result = await this.noteHelper.insert({
                    Author: author,
                    Note: req.headers["note"],
                    createAt: new Date().getTime(),
                });
                if (result) {
                    res.json({
                        success: true,
                        message: "Add Note Success",
                        data: result,
                    });
                } else {
                    res.json({
                        success: false,
                        message: "Add Note Failed",
                    });
                }
            } else {
                //get Job Data
                const job = await this.dbHelper.findOne({
                    _id: new ObjectId(req.headers["job_id"]),
                });

                //insert Note to database
                const result = await this.noteHelper.insert({
                    Author: author,
                    Note: req.headers["note"],
                    Job: job,
                    createAt: new Date().getTime(),
                });

                if (result) {
                    res.json({
                        success: true,
                        message: "Add Note Success",
                        data: result,
                    });
                } else {
                    res.json({
                        success: false,
                        message: "Add Note Failed",
                    });
                }
            }
        });

        this.app.get("/deleteNote", async (req, res) => {
            if (!req.headers["note_id"]) {
                return res.json({
                    success: false,
                    message: "Note_id is required",
                });
            }
            const result = await this.noteHelper.findOneAndDelete({
                _id: new ObjectId(req.headers["note_id"]),
            });

            if (result) {
                res.json({
                    success: true,
                    message: "Delete Note Success",
                });
            } else {
                res.json({
                    success: false,
                    message: "Delete Note Failed",
                });
            }
        });

        this.app.get("/getAppNote", async (req, res) => {
            if (!req.headers["usertoken"]) {
                return res.json({
                    success: false,
                    message: "UserToken is required",
                });
            }

            const author = await this.loginHelper.findOne(
                {
                    UserToken: req.headers["usertoken"],
                },
                { projection: { password: 0 } }
            );

            const result = await this.noteHelper.find({
                "Author._id": author._id,
            });

            if (result) {
                res.json({
                    success: true,
                    message: "Get App Note Success",
                    data: result,
                });
            } else {
                res.json({
                    success: false,
                    message: "Get App Note Failed",
                });
            }
        });

        this.app.get("/getNote", async (req, res) => {
            if (!req.headers["usertoken"]) {
                return res.json({
                    success: false,
                    message: "UserToken is required",
                });
            }
            const author = await this.loginHelper.findOne(
                {
                    UserToken: req.headers["usertoken"],
                },
                { projection: { password: 0 } }
            );
            if (!req.headers["note_id"]) {
                if (!req.headers["job_id"]) {
                    return res.json({
                        success: false,
                        message: "Job_id or note_id is required",
                    });
                } else {
                    const job = await this.dbHelper.findOne({
                        _id: new ObjectId(req.headers["job_id"]),
                    });

                    const result = await this.noteHelper.findOne({
                        Job: job,
                        Author: author,
                    });
                    if (result) {
                        res.json({
                            success: true,
                            message: "Get Note Success",
                            data: result,
                        });
                    } else {
                        res.json({
                            success: false,
                            message: "Get Note Failed",
                        });
                    }
                }
            } else {
                const result = await this.noteHelper.findOne({
                    _id: new ObjectId(req.headers["note_id"]),
                });
                if (result) {
                    res.json({
                        success: true,
                        message: "Get Note Success",
                        data: result,
                    });
                } else {
                    res.json({
                        success: false,
                        message: "Get Note Failed",
                    });
                }
            }
        });

        this.app.get("/getExistNote", async (req, res) => {
            if (!req.headers["user_id"] || !req.headers["job_id"]) {
                return res.json({
                    success: false,
                    message: "User_id and Job_id is required",
                });
            }

            const result = await this.noteHelper.findOne({
                Job_id: req.headers["job_id"],
                Author: { _id: new ObjectId(req.headers["user_id"]) },
            });

            if (result) {
                res.json({
                    success: true,
                    message: "Get Note Success",
                    data: result,
                });
            } else {
                res.json({
                    success: false,
                    message: "Get Note Failed",
                });
            }
        });

        this.app.get("/postJob", async (req, res) => {
            if (!req.headers["usertoken"]) {
                return res.json({
                    success: false,
                    message: "UserToken is required",
                });
            }

            //get author name and id by userToken
            const author = await this.loginHelper.findOne(
                {
                    UserToken: req.headers["usertoken"],
                },
                { projection: { password: 0 } }
            );

            const result = await this.dbHelper.insert({
                Title: req.headers["jobtitle"],
                Details: req.headers["jobdetails"],
                Author: author.username,
                AuthorID: author._id,
                Timestamp: Date.now(),
            });

            res.json({
                success: true,
                message: "Post Success",
                data: result,
            });
        });

        this.app.get("/getUser", async (req, res) => {
            if (!req.headers["usertoken"]) {
                return res.json({
                    success: false,
                    message: "UserToken is required",
                });
            }

            const result = await this.loginHelper.findOne({
                UserToken: req.headers["usertoken"],
            });
            res.json({
                success: true,
                message: "Get User Success",
                data: result,
            });
        });

        this.app.get("/deleteJob", async (req, res) => {
            if (!req.headers["jobid"]) {
                return res.json({
                    success: false,
                    message: "Job ID is required",
                });
            }
            const result = await this.dbHelper.findOneAndDelete({
                _id: ObjectId(req.headers["jobid"]),
            });
            if (result.value != null) {
                res.json({
                    success: true,
                    message: "Delete Success",
                });
            } else {
                res.json({
                    success: false,
                    message: "Delete Failed",
                });
            }

            //also delete all following jobs record
            const following = await this.followingHelper.deleteMany({
                Job_id: ObjectId(req.headers["jobid"]),
            });

            //also delete all report record
            const report = await this.reportHelper.deleteMany({
                Job_id: ObjectId(req.headers["jobid"]),
            });
        });

        this.app.get("/getAllFollowingJobData", async (req, res) => {
            if (!req.headers["user_id"]) {
                return res.json({
                    success: false,
                    message: "User ID is required",
                });
            }
            const followingResult = await this.followingHelper.find(
                {
                    User_id: ObjectId(req.headers["user_id"]),
                },
                {},
                {
                    Timestamp: 1,
                }
            );
            if (followingResult) {
                let allFollowingJobID = followingResult.map(
                    (item) => item.Job_id
                );
                //get all job data by job id
                const allJobData = await this.dbHelper.find({
                    _id: {
                        $in: allFollowingJobID,
                    },
                });
                //foreach data, using AuthorID to find avatar data in database and then send back the job data
                const allJobDataWithAvatar = await Promise.all(
                    allJobData.map(async (item) => {
                        const author = await this.loginHelper.findOne(
                            {
                                _id: item.AuthorID,
                            },
                            {
                                projection: { avatar: 1, _id: 0 },
                            }
                        );
                        return {
                            ...item,
                            AuthorAvatar: author.avatar,
                        };
                    })
                );
                res.json({
                    success: true,
                    message: "Get All Following Job Data Success",
                    data: allJobDataWithAvatar,
                });
            } else {
                res.json({
                    success: false,
                    message: "Get All Following Job Failed",
                });
            }
        });

        this.app.get("/deleteAllJob", async (req, res) => {
            await this.dbHelper.deleteMany({});
            res.json({ success: true, message: "Delete Success" });
        });

        this.app.get("/getAllJobData", async (req, res) => {
            const allJobData = await this.dbHelper.find(
                {},
                {},
                { Timestamp: -1 }
            );
            if (allJobData) {
                //foreach data, using AuthorID to find avatar data in database and then send back the job data
                const allJobDataWithAvatar = await Promise.all(
                    allJobData.map(async (item) => {
                        const author = await this.loginHelper.findOne(
                            {
                                _id: item.AuthorID,
                            },
                            {
                                projection: { avatar: 1, _id: 0 },
                            }
                        );

                        return {
                            ...item,
                            AuthorAvatar: author.avatar,
                        };
                    })
                );
                res.json({
                    success: true,
                    message: "Get All Job Data Success",
                    data: allJobDataWithAvatar,
                });
            } else {
                res.json({
                    success: false,
                    message: "Get All Job Data Failed",
                });
            }
        });

        this.app.get("/checkFollowing", async (req, res) => {
            if (!req.headers["user_id"]) {
                return res.json({
                    success: false,
                    message: "User ID is required",
                });
            }
            if (!req.headers["job_id"]) {
                return res.json({
                    success: false,
                    message: "Job ID is required",
                });
            }
            const result = await this.followingHelper.findOne({
                User_id: ObjectId(req.headers["user_id"]),
                Job_id: ObjectId(req.headers["job_id"]),
            });
            if (result) {
                res.json({
                    success: true,
                    message: "Check Following Success",
                    data: result,
                });
            } else {
                res.json({
                    success: false,
                    message: "Check Following Failed",
                });
            }
        });

        this.app.get("/unfollowJob", async (req, res) => {
            if (!req.headers["user_id"]) {
                return res.json({
                    success: false,
                    message: "User ID is required",
                });
            }
            if (!req.headers["job_id"]) {
                return res.json({
                    success: false,
                    message: "Job ID is required",
                });
            }
            const result = await this.followingHelper.findOneAndDelete({
                User_id: ObjectId(req.headers["user_id"]),
                Job_id: ObjectId(req.headers["job_id"]),
            });
            if (result.value != null) {
                res.json({
                    success: true,
                    message: "Unfollow Success",
                });
            } else {
                res.json({
                    success: false,
                    message: "Unfollow Failed",
                });
            }
        });

        this.app.get("/followJob", async (req, res) => {
            if (!req.headers["user_id"]) {
                return res.json({
                    success: false,
                    message: "User ID is required",
                });
            }
            if (!req.headers["job_id"]) {
                return res.json({
                    success: false,
                    message: "Job ID is required",
                });
            }
            const result = await this.followingHelper.insert({
                User_id: ObjectId(req.headers["user_id"]),
                Job_id: ObjectId(req.headers["job_id"]),
            });
            if (result) {
                res.json({
                    success: true,
                    message: "Follow Success",
                });
            } else {
                res.json({
                    success: false,
                    message: "Follow Failed",
                });
            }
        });

        this.app.get("/getJobData", async (req, res) => {
            const result = await this.dbHelper.findOne({
                _id: new ObjectId(req.headers["job_id"].toString()),
            });
            if (result) {
                res.json({
                    success: true,
                    message: "Get Job Data Success",
                    data: result,
                });
            } else {
                res.json({
                    success: false,
                    message: "Get Job Data Failed",
                });
            }
        });

        //accept base64 image format and save it into database with userid
        this.app.post("/updateAvatar", async (req, res) => {
            if (!req.headers["_id"]) {
                return res.json({
                    success: false,
                    message: "UserID is required",
                });
            }
            //get avatar base64 in request body
            let avatar = req.body.avatar;
            const result = await this.loginHelper.findOneAndUpdate(
                {
                    _id: ObjectId(req.headers["_id"]),
                },
                {
                    $set: {
                        avatar: avatar,
                    },
                }
            );
            if (result.value != null) {
                res.json({
                    success: true,
                    message: "Update Avatar Success",
                });
            } else {
                res.json({
                    success: false,
                    message: "Update Avatar Failed",
                });
            }
        });

        this.app.post(
            "/updateResume",
            upload.single("pdf"),
            async (req, res, next) => {
                return res.json({
                    success: true,
                    message: "Update Resume Success",
                });
            }
        );

        this.app.get("/getResume/:target", async (req, res) => {
            if (!req.params.target)
                return res.json({
                    success: false,
                    message: "Target is required",
                });
            let target = req.params.target;

            //check pdf file exists
            let result = await fs.promises
                .access(`${path.join(__dirname, "../uploads/")}${target}`)
                .then(() => true)
                .catch(() => false);
            if (result) {
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader(
                    `Content-Dispositon`,
                    `attachment; filename=${target}`
                );
                return res.download(
                    `${path.join(__dirname, "../uploads/")}${target}`,
                    target
                );
            } else {
                return res.json({
                    success: false,
                    message: "Resume not found",
                });
            }
        });

        this.app.get("/checkChatRoom", async (req, res) => {
            if (!req.headers.user_id) {
                return res.json({
                    success: false,
                    message: "User ID is required",
                });
            }
            if (!req.headers.target_id) {
                return res.json({
                    success: false,
                    message: "Target ID is required",
                });
            }
            //find record that contains both user and target id
            const result = await this.chatRoomHelper.findOne({
                Users: {
                    $all: [
                        ObjectId(req.headers.user_id),
                        ObjectId(req.headers.target_id),
                    ],
                },
            });
            if (result) {
                res.json({
                    success: true,
                    message: "Check Chat Room Success",
                    data: result,
                });
            } else {
                res.json({
                    success: false,
                    message: "Check Chat Room Failed",
                });
            }
        });

        this.app.get("/checkResume", async (req, res) => {
            if (!req.headers["target_id"]) {
                return res.json({
                    success: false,
                    message: "Target UserID is required",
                });
            }
            let result = await fs.promises
                .access(
                    `${path.join(__dirname, "../uploads/")}${
                        req.headers["target_id"]
                    }_resume.pdf`
                )
                .then(() => true)
                .catch(() => false);

            if (result) {
                res.json({
                    success: true,
                    message: "Resume Exist",
                });
            } else {
                res.json({
                    success: false,
                    message: "Resume Not Exist",
                });
            }
        });

        this.app.get("/jobReport", async (req, res) => {
            if (!req.headers["job_id"]) {
                return res.json({
                    success: false,
                    message: "Job ID is required",
                });
            }
            if (!req.headers["user_id"]) {
                return res.json({
                    success: false,
                    message: "User ID is required",
                });
            }
            //check duplicate report
            const result = await this.reportHelper.findOne({
                User_id: new ObjectId(req.headers["user_id"]),
                Job_id: new ObjectId(req.headers["job_id"]),
            });
            if (result) {
                //duplicate report
                return res.json({
                    success: false,
                    message: "Duplicate Report",
                });
            } else {
                //insert report
                const reportSubmition = await this.reportHelper.insert({
                    User_id: new ObjectId(req.headers["user_id"]),
                    Job_id: new ObjectId(req.headers["job_id"]),
                    reportTimestamp: Date.now(),
                    reportReason: req.headers["report_reason"],
                });
                if (reportSubmition) {
                    return res.json({
                        success: true,
                        message: "Report Success",
                    });
                } else {
                    return res.json({
                        success: false,
                        message: "Report Failed",
                    });
                }
            }
        });

        this.app.get("/createNewChatRoom", async (req, res) => {
            if (!req.headers["user_id"]) {
                return res.json({
                    success: false,
                    message: "User ID is required",
                });
            }
            if (!req.headers["target_id"]) {
                return res.json({
                    success: false,
                    message: "target id is required",
                });
            }
            //check database exits this 2 users chat room
            const result = await this.chatRoomHelper.findOne({
                Users: [
                    new ObjectId(req.headers["user_id"]),
                    new ObjectId(req.headers["target_id"]),
                ],
            });
            //not found
            if (result === null) {
                const newChatRoom = await this.chatRoomHelper.insert({
                    Users: [
                        new ObjectId(req.headers["user_id"]),
                        new ObjectId(req.headers["target_id"]),
                    ],
                });
                if (newChatRoom) {
                    res.json({
                        success: true,
                        message: "Create Chat Room Success",
                        data: newChatRoom,
                    });
                } else {
                    res.json({
                        success: false,
                        message: "Create Chat Room Failed!",
                    });
                }
            } else {
                //record exist
                res.json({
                    success: false,
                    message: "Chat Room Exist",
                    data: result,
                });
            }
        });

        //get avatar by user id
        this.app.get("/getAvatarByID", async (req, res) => {
            if (!req.headers["_id"]) {
                return res.json({
                    success: false,
                    message: "UserID is required",
                });
            }
            const result = await this.loginHelper.findOne({
                _id: ObjectId(req.headers["_id"]),
            });
            if (result) {
                res.json({
                    success: true,
                    message: "Get Avatar Success",
                    data: result.avatar,
                });
            } else {
                res.json({
                    success: false,
                    message: "Get Avatar Failed",
                });
            }
        });

        //io server
        setInterval(() => {
            this.io.sockets.emit("time-msg", {
                time: new Date().toISOString(),
            });
        }, 1000);

        //when client connect to io server, send back all require data for chatlist
        this.io.on("connect", (socket) => {
            if (!socket.handshake.auth._id) {
                socket.disconnect();
            }
        });
        this.io.on("connection", (socket) => {
            socket.on("disconnect", (reason) => {
                // console.log(reason);
            });
            socket.on("getChatRoomData", async () => {
                //fetch all chatRoom data from database
                const result = await this.chatRoomHelper.find({
                    Users: new ObjectId(socket.handshake.auth._id),
                });

                if (result) {
                    let chatListData = await Promise.all(
                        result.map(async (chatRoomObject) => {
                            const lastMessageObject =
                                await this.msgHelper.findOne({
                                    _id: new ObjectId(
                                        chatRoomObject.lastMessage
                                    ),
                                });
                            const targetUser =
                                chatRoomObject.Users[0] ==
                                socket.handshake.auth._id
                                    ? chatRoomObject.Users[1]
                                    : chatRoomObject.Users[0];
                            const targetUserObject =
                                await this.loginHelper.findOne(
                                    {
                                        _id: new ObjectId(targetUser),
                                    },
                                    {
                                        projection: { avatar: 1, username: 1 },
                                    }
                                );
                            chatRoomObject.lastMessageContent =
                                lastMessageObject?.content
                                    ? lastMessageObject.content
                                    : "";
                            chatRoomObject.lastMessageTime =
                                lastMessageObject?.createAt
                                    ? lastMessageObject.createAt
                                    : 0;
                            chatRoomObject.targetUser = targetUserObject;

                            // console.log(
                            //     `${chatRoomObject.Users[0]} \n${socket.handshake.auth._id}`
                            // );
                            return {
                                ...chatRoomObject,
                            };
                        })
                    );
                    //array sorting (descending order by lastMessageTime)
                    chatListData = chatListData.sort((a, b) => {
                        return b.lastMessageTime - a.lastMessageTime;
                    });

                    //for each chatListData, let client socket join chat rooms
                    chatListData.forEach((chatRoomObject) => {
                        socket.join(chatRoomObject._id);
                    });

                    //emit sorted array
                    socket.emit("chatRoomData", {
                        success: true,
                        message: "Get Chat Room Data Success",
                        data: chatListData,
                    });
                } else {
                    socket.emit("chatRoomData", {
                        success: false,
                        message: "Get Chat Room Data Failed",
                    });
                }
            });
            socket.on("getAllChatData", async (chatRoomID) => {
                //add socket to room
                socket.join(chatRoomID);
                //fetch all chat data from database
                const result = await this.msgHelper.find(
                    {
                        CR_id: new ObjectId(chatRoomID),
                    },
                    {},
                    { createdAt: 1 }
                );
                if (result) {
                    socket.emit("allChatData", {
                        success: true,
                        message: "Get All Chat Data Success",
                        data: result,
                    });
                } else {
                    socket.emit("allChatData", {
                        success: false,
                        message: "Get All Chat Data Failed",
                    });
                }
            });
            socket.on("sendMessage", async (data) => {
                let message = data.message;
                let chatRoomID = data.chatRoomID;
                let createdAt = Date.now();
                let authorID = socket.handshake.auth._id;

                const newMessage = await this.msgHelper.insert({
                    content: message,
                    CR_id: new ObjectId(chatRoomID),
                    Author: new ObjectId(authorID),
                    createAt: createdAt,
                });
                if (newMessage) {
                    //update chat room last message
                    const updateChatRoom =
                        await this.chatRoomHelper.findOneAndUpdate(
                            {
                                _id: new ObjectId(chatRoomID),
                            },
                            {
                                $set: {
                                    lastMessage: newMessage.insertedId,
                                },
                            }
                        );
                    if (updateChatRoom) {
                        //get New Message data
                        const newMessageData = await this.msgHelper.findOne({
                            _id: new ObjectId(newMessage.insertedId),
                        });
                        // console.log(newMessageData);
                        socket.to(chatRoomID).emit("newMessage", {
                            success: true,
                            message: "New Message",
                            data: newMessageData,
                        });
                    }
                }
            });
        });

        //start app
        this.server.listen(this.config.port, () => {
            console.log("Listening on port " + this.config.port);
        });

        // start https
        // this.httpsServer.listen(443, () => {
        //     console.log("Https Listening on port 443");
        // });
    }
};
