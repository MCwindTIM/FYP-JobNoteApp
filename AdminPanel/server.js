const express = require("express");

const AdminBro = require("admin-bro");
const mongooseAdminBro = require("@adminjs/mongoose");
const expressAdminBro = require("@admin-bro/express");
const app = express();

app.get("/", (req, res) => {
    res.redirect(adminBro.options.rootPath);
});
// Database
const connection = require("./config/db.config");

connection.once("open", () => console.log("Database connected Successfully"));
connection.on("error", (err) => console.log("Error", err));

//Admin Bro and Models
const Admin = require("./models/Admin");
const Job = require("./models/Job");
const Note = require("./models/Note");
const Message = require("./models/Message");
const Following = require("./models/Following");
const User = require("./models/User");
const Report = require("./models/Report");
const ChatRoom = require("./models/ChatRoom");

const locale = {
    translations: {
        labels: {
            loginWelcome: "Welcome",
        },
        messages: {
            loginWelcome: "Please login to get access to the admin panel",
        },
    },
};

AdminBro.registerAdapter(mongooseAdminBro);
const AdminBroOptions = {
    resources: [
        {
            resource: Job,
            options: {
                properties: {
                    Title: {
                        components: {
                            list: AdminBro.bundle(
                                "./component/job-title-in-list"
                            ),
                        },
                    },
                    Details: {
                        components: {
                            list: AdminBro.bundle(
                                "./component/job-details-in-list"
                            ),
                        },
                    },
                    Author: {
                        components: {
                            list: AdminBro.bundle(
                                "./component/job-author-in-list"
                            ),
                        },
                    },
                },
                actions: {
                    show: {
                        handler: async (req, res, ctx) => {
                            const job = ctx.record;
                            job.params.Title = decodeURIComponent(
                                job.params.Title
                            );
                            job.params.Author = decodeURIComponent(
                                job.params.Author
                            );
                            job.params.Details = decodeURIComponent(
                                job.params.Details
                            );
                            return {
                                record: job.toJSON(ctx.currentAdmin),
                            };
                        },
                    },
                    edit: {
                        //before request, encodeURIComponent to Title, Details
                        before: async (request, ctx) => {
                            if (request.method === "post") {
                                request.payload.Title = encodeURIComponent(
                                    request.payload.Title
                                );
                                request.payload.Details = encodeURIComponent(
                                    request.payload.Details
                                );
                                return request;
                            }
                            if (request.method === "get") {
                                const job = ctx.record;
                                job.params.Title = decodeURIComponent(
                                    job.params.Title
                                );
                                job.params.Details = decodeURIComponent(
                                    job.params.Details
                                );
                                return request;
                            }
                        },
                    },
                    new: {
                        before: async (request) => {
                            if (request.method === "post") {
                                request.payload = {
                                    ...request.payload,
                                    Title: encodeURIComponent(
                                        request.payload.Title
                                    ),
                                    Details: encodeURIComponent(
                                        request.payload.Details
                                    ),
                                };
                                return request;
                            }
                        },
                    },
                },
            },
        },
        {
            resource: Note,
            options: {
                properties: {
                    Note: {
                        components: {
                            list: AdminBro.bundle("./component/note-in-list"),
                        },
                    },
                },
                actions: {
                    show: {
                        handler: async (req, res, ctx) => {
                            const note = ctx.record;
                            note.params.Note = decodeURIComponent(
                                note.params.Note
                            );
                            return {
                                record: note.toJSON(ctx.currentAdmin),
                            };
                        },
                    },
                    edit: {
                        //before request, encodeURIComponent to Note
                        before: async (request, ctx) => {
                            if (request.method === "post") {
                                request.payload = {
                                    ...request.payload,
                                    Note: encodeURIComponent(
                                        request.payload.Note
                                    ),
                                };
                                return request;
                            }
                            if (request.method === "get") {
                                const note = ctx.record;
                                note.params.Note = decodeURIComponent(
                                    note.params.Note
                                );
                                return request;
                            }
                        },
                    },
                    new: {
                        before: async (request) => {
                            if (request.method === "post") {
                                request.payload = {
                                    ...request.payload,
                                    Note: encodeURIComponent(
                                        request.payload.Note
                                    ),
                                };
                                return request;
                            }
                        },
                    },
                },
            },
        },
        {
            resource: Message,
            options: {
                properties: {
                    content: {
                        components: {
                            list: AdminBro.bundle(
                                "./component/message-content-in-list"
                            ),
                        },
                    },
                },
                actions: {
                    show: {
                        handler: async (req, res, ctx) => {
                            const message = ctx.record;
                            message.params.content = decodeURIComponent(
                                message.params.content
                            );
                            return {
                                record: message.toJSON(ctx.currentAdmin),
                            };
                        },
                    },
                    edit: {
                        //before request, encodeURIComponent to content
                        before: async (request, ctx) => {
                            if (request.method === "post") {
                                request.payload = {
                                    ...request.payload,
                                    content: encodeURIComponent(
                                        request.payload.content
                                    ),
                                };
                                return request;
                            }
                            if (request.method === "get") {
                                const message = ctx.record;
                                message.params.content = decodeURIComponent(
                                    message.params.content
                                );
                                return request;
                            }
                        },
                    },
                    new: {
                        before: async (request) => {
                            if (request.method === "post") {
                                request.payload = {
                                    ...request.payload,
                                    content: encodeURIComponent(
                                        request.payload.content
                                    ),
                                };
                                return request;
                            }
                        },
                    },
                },
            },
        },
        Following,
        {
            resource: User,
            options: {
                properties: {
                    avatar: {
                        components: {
                            list: AdminBro.bundle(
                                "./component/user-avatar-in-list"
                            ),
                        },
                    },
                    username: {
                        components: {
                            list: AdminBro.bundle(
                                "./component/user-username-in-list"
                            ),
                        },
                    },
                },
                actions: {
                    show: {
                        handler: async (req, res, ctx) => {
                            const user = ctx.record;
                            user.params.username = decodeURIComponent(
                                user.params.username
                            );
                            return {
                                record: user.toJSON(ctx.currentAdmin),
                            };
                        },
                    },
                    edit: {
                        //before request, encodeURIComponent to username
                        before: async (request, ctx) => {
                            if (request.method === "post") {
                                request.payload.username = encodeURIComponent(
                                    request.payload.username
                                );
                                return request;
                            }
                            if (request.method === "get") {
                                const user = ctx.record;
                                user.params.username = decodeURIComponent(
                                    user.params.username
                                );
                                return request;
                            }
                        },
                    },
                    new: {
                        before: async (request) => {
                            if (request.method === "post") {
                                request.payload.username = encodeURIComponent(
                                    request.payload.username
                                );
                                return request;
                            }
                        },
                    },
                },
            },
        },
        Report,
        ChatRoom,
    ],
    locale,
    dashboard: {
        handler: async () => {
            return { test: "test" };
        },
        component: AdminBro.bundle("./component/dashboard"),
    },
    branding: {
        companyName: "Job App",
        softwareBrothers: false,
        logo: "http://223.16.12.55/logo",
        favicon: "http://223.16.12.55/favicon",
    },
};

const adminBro = new AdminBro(AdminBroOptions);
const router = expressAdminBro.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
        if (email === "admin@admin.com" && password === "admin") {
            return { email: "admin@admin.com", password: "admin" };
        }
        return null;
    },
    cookieName: "admin",
    cookiePassword: "password",
});

app.use(adminBro.options.rootPath, router);

app.listen(8000, () => {
    console.log("Listening at Port 8000");
});
