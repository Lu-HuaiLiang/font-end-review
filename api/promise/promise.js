class myPromise {
  status = 'pending';
  value;
  constructor(executor) {
    this.resolveQueue = [];
    this.rejectedQueue = [];
    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = 'value';
        setTimeout(() => {
          while (this.resolveQueue.length) {
            let thenResolveFn = this.resolveQueue.shift();
            thenResolveFn(value);
          }
        });
      }
    };
    const rejected = (value) => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.value = 'value';
        setTimeout(() => {
          while (this.resolveQueue.length) {
            let thenRejectedFn = this.rejectedQueue.shift();
            thenRejectedFn(value);
          }
        });
      }
    };
    executor(resolve, rejected);
  }
  then(resolveFn, rejectFn) {
    if (this.status === 'fulfilled') {
      resolveFn(this.value);
    } else if (this.status === 'rejected') {
      rejectFn(this.value);
    } else if (this.status === 'pending') {
      // 这里的处理的情况是外界 setTimeout(()=>resolve())
      this.resolveQueue.push(resolveFn);
      this.rejectedQueue.push(rejectFn);
    }
  }
}
