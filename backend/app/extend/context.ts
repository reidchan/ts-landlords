const newContext: any = {

  success(data: any, message = null) {
    this.body = {
      success: true,
      message,
      data,
    };
    this.status = 200;
  },

  fail(message = null) {
    this.body = JSON.stringify({
      success: false,
      message,
    });
    this.status = 500;
  },

};

export default newContext;
