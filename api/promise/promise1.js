class myPromise {
  status = 'pending';
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
      return new Promise((resolve, rejected) => {
        try {
          const result = resolveFn(this.value);
          resolve(result);
        } catch (error) {
          rejected(error);
        }
      });
    } else if (this.status === 'rejected') {
      return new Promise((resolve, rejected) => {
        try {
          const result = rejectFn(this.value);
          resolve(result);
        } catch (error) {
          rejected(error);
        }
      });
    } else if (this.status === 'pending') {
      // 这里的处理的情况是外界 setTimeout(()=>resolve())
      return new Promise((resolve, rejected) => {
        let fulfilledQ = (val) => {
          try {
            const result = rejectFn(val);
            resolve(result);
          } catch (error) {
            rejected(error);
          }
        };
        let rejectedQ = (val) => {
          try {
            const result = rejectFn(val);
            resolve(result);
          } catch (error) {
            rejected(error);
          }
        };
        this.resolveQueue.push(fulfilledQ);
        this.rejectedQueue.push(rejectedQ);
      });
    }
  }
}
