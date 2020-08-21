let install = function (Vue) {
    Object.defineProperties(Vue.prototype, {
        $round: {
            get() {
                return {
                    random(id){
                        return id + Math.round(Math.random() * 100000000);
                    }
                }
            }
        },
    })
}
export default {
    install
}
