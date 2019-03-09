# Student-Portal
 A web based portal for students to check their marks and access resources, circulars and other notifications pertaining to college.  
 
 ###### Created by:  
 * [Sanjitha Singh](https://github.com/SanjithaSingh)
 * [Amit Kumar Gupta](https://github.com/Amit-Kumar-G/)
 
 ***NOTE: This project is under the MIT open source license. For more information, see [LICENSE](./LICENSE)***
 
 ### Requirements
 Node.js LTS (10.15.3) : https://nodejs.org/en/  
 MongoDB (4.0.6) : https://www.mongodb.com/   
   
 ***NOTE:** MongoDB atlas may be used as well, however this document uses the community server edition hosted on a local machine.*     
   
 ### Node.js setup  
 After following the installer instructions to install node, navigate to the project directory:  
   
 `npm install`  
   
 This will install all the node modules and dependencies according to the package.json file.  
   
 ***NOTE:** This project does not upload local node-modules, and any deprecated packages will have to be fixed by the contribitors. For more, see [issues](https://github.com/Amit-Kumar-G/Student-Portal/issues)*
   
This project uses npm start scripts to run the project under two modes: **dev** and **release**.  

### MongoDB setup  
 After following the installer instructions to install mongo, navigate to any directory of your choice:  
   Create the folder **/data/db** and note the path.  
     
 ***NOTE: If on a local machine, it is reccomended to create /data/db in C:/ drive or ~/ (home) drive on windows or unix systems respectively.***    
   
  ***NOTE: When deploying remotely on a unix server, it is compulsary to create /data/db in the '/' (root) directory. You will need admin privilages for this, or use 'fakeroot'. Contact your system administrator for the same.***  
    

### Starting the mongoDB service  
To start the mongodb service, the reccomended command is `mongod`, _however_ systemctl can be used on unix systems that use systemd.  
  
On unix:  
`systemctl start mongodb.service`  
  
On windows / using mongod:  
`mongod --dbpath [Your /data/db path]/data/db`  
  
This will start the mongodb servie in the background.
  
### Starting the server  

***NOTE: Make sure the mongoDB server is running. See above.***  
  
To start the Node.js server, we will use npm start scripts.  
  
**Usage**  
  
`npm run [CONFIG] [PORT] [COOKIE-SECRET]`  
`where,`    
`[CONFIG] is one of: dev, and release`  
`[PORT] is the port you wish to run the server on,`    
`[COOKIE-SECRET] is the secret with which the cookies sent to your clients will be encrypted with.`  
  
    
To run on a local machine:  
  `npm run dev 8080 mysecret`  
    
Open a web browser on localhost, port of your choice, and bob's your uncle.  
For any questions/queries, contact the contributors or raise an issue.  

That's all folks.
