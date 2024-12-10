class ExpressError extends Error{
    constructor(status,message){
      super();
      this.status=status;
      this.message=message;
    }
}
module.exports = ExpressError ;

// utils/expressError.js

// class ExpressError extends Error {
//   constructor(statusCode, message) {
//       super();
//       this.statusCode = statusCode;
//       this.message = message;
//   }
// }

// module.exports = ExpressError;
