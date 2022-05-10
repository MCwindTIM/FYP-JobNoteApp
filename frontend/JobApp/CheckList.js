//Client Side
//#DONE: Add login screen
//#DONE: Add register screen
//#DONE: Handle basic user authentication (Sign in/Sign up/Sign out function)
//#DONE: Add biometric authentication (Touch ID/Face ID)
//#DONE: Add user avatar
//#DONE: Add tab navigation screen (Job List/Chat/Setting)
//#DONE: Handling user upload avatar functionality
//#DONE: Add drawer navigation (JobList/NotesList/Following Job)
//#DONE: Job list searching functionality (works with job title / username)
//#DONE: Add user token to authenticate user session
//#DONE: User is post author ? checking (✅ show delete btn / ❌ show message/mail/report btn)
//#DONE: Redesign UI, Theme Color !!! FIXING Some non ASCII characters are showing url encoded string (Using decodeURIComponent)
//#TODO: Add Job Modification Functionality if Author is the same as the logged in user
//#DONE: Add notes system
//#DONE: Add Job follow/unfollow functionality
//#DONE: Add Button to Add Notes for current job offer
//#DONE: Route param to pass between screens (JobList=>JobDetails)
//#DONE: Route param to pass between screens (JobDetails=>ChatList)
//#DONE: Route param to pass between screens (ChatList=>Chat)
//#DONE: Route param to pass between screens (JobDetails=>CreateNotes/InspectNotes)
//#DONE: Check notes can standalone / have relationship with job post
//#DONE: Notes create timestamp
//#DONE: Add Report function
//#DONE: redesign delete alert => using react native modal component
//#DONE: Notes Content Screen UI redesign ★★★★★
//#DONE: Modal design for deleting notes ★★★★★
//#DONE: Job report modal UI (select reason to report)
//#DONE: Add **real time** chat platform by using websocket (socket.io)
//#DONE: Add message timestamp
//#DONE: Add job post timestamp
//#DONE: Parse hyperlink in message
//#DONE: Making url preview in message
//#DONE: Remove job list duplicate refresh behavior (making too many request to server)
//#FIXME: Message record should be cached in AsyncStorage ↓↓↓↓↓↓Solution↓↓↓↓↓↓
//#TODO: Do not fetch all messages from server, making cache system for messages
//#DONE: Let user upload their profile/resume as PDF file for better job applying experience
//#DONE: Upgrade expo from sdk 44 → sdk 45

//Server Side
//#DONE: Making Object [App],[Config],[Server],[Util],[DBhelper]
//#DONE: Add Cross-Origin Resource Sharing Setting (CORS)
//#DONE: Setting up the server (Express)
//#DONE: Setting up websocket Server (Socket.io)
//#DONE: Setting up the database (MongoDB)
//#DONE: Create API routes by using Express
//#DONE: Handle User Avatar Upload request
//#DONE: handle Report Post request function
//#DONE: Delete all report record when deleting job post
//#DONE: Making API for data management => server side
//#DONE: Encode all string to url encoded string
//#DONE: Server Supporting http/https => server side
//#DONE: Using CloudFlare services to provide free SSL / TLS security
//#DONE: Handling user PDF file uploading

//Cross Platform testing
//#DONE: Android API V30+ testing (Android 11 & Android 12)
//#FIXME: Web app bundles are not working at all (Doesn't matter)
//#DONE: IOS support testing

//Web Case Management System (Admin Panel)
//#DONE: CRUD operation for job post
//#DONE: CRUD operation for notes
//#DONE: CRUD operation for user
//#DONE: CRUD operation for report
//#DONE: CRUD operation for chat
//#DONE: CRUD operation for message
