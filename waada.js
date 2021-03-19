// not intended for production use

class Waada {
    resFn = ()=>{}
    rejFn = undefined
    child = undefined;
    childRes=()=>{}
    childRej=()=>{}
    resolved = false;
    rejected = false;
    value = undefined;
    parent = undefined;

    getVal(){
        return this.value !== undefined ? this.value : (this.parent && this.parent.getVal())
    }
    resolve(value){
        this.resolved = true;
        this.value = value;
        this.resolver()
    }
    resolver(){
        if(this.resolved && !this.rejected){
            let val = this.resFn(this.getVal())
            this.childRes(val);
        }
    }

    reject(value){
        this.rejected = true;
        this.value = value;
        this.rejector()
    }
    rejector(){
        if(this.rejected && !this.resolved){
            let val = this.getVal();
            if(!this.rejFn){
                this.childRej(val);
            } else {
                this.rejFn(val);
            }
        }
    }

    constructor(fn,parent){
        this.parent = parent;
        fn(value => this.resolve(value), err => this.reject(err))
    }
    then(fn){
        this.resFn = fn
        this.child = this.child || new waada((res,rej)=>{this.childRes=res;this.childRej=rej},this);
        this.resolver();
        this.rejector();
        return this.child;
    }
    catch(fn){
        this.rejFn = fn
        this.child = this.child || new waada((res,rej)=>{this.childRes=res;this.childRej=rej},this);
        this.resolver();
        this.rejector();
        return this.child;
    }
}

// example usage

new Waada((resolve,reject)=>{
    setTimeout(()=>{
        resolve('done')
    },5000)
}).then(v => v+' - yes').then(console.log).then(v => 1).then(console.log)