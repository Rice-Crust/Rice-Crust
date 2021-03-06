// 带并发限制的异步调度器，保证同时最多运行2个任务
class Scheduler {
    myLength = 2;
    tasks: Array<any> = [];
    count = 0;
    
    // @ts-ignore
    async add(promiseFunc: () => Promise<void>): Promise<void> {
        if (this.count >= this.myLength) {
            // @ts-ignore
            return new Promise(resolve => {
                this.tasks.push(() => promiseFunc().then(resolve));
            });
        }

        this.count += 1;
        await promiseFunc();
        this.count -= 1;

        if (this.tasks.length) {
            this.add(this.tasks.shift());
        }
    }
}






const scheduler = new Scheduler();

const timeout = (time): Promise<void> => {
    // @ts-ignore
    return new Promise(r => setTimeout(r, time))
}

const addTask = (time, order) => {
    scheduler.add(() => timeout(time))
        .then(() => {
            console.log(order)
        })
}

addTask(1000, 1);
addTask(500, 2);
addTask(400, 3);
addTask(50, 4);
