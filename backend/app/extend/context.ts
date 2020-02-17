const newContext: any = {

  success(data: any, message = null) {
    this.body = {
      success: true,
      message,
      data,
    };
    this.status = 200;
  },

  fail(message = null, status = 500) {
    this.body = JSON.stringify({
      success: false,
      message,
    });
    this.status = status;
  },

};

export default newContext;
