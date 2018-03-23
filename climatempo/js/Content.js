(function(_global) {

    /**
     * Classe to implement 4YouSee Player communications with HTML Content
     *
     * @class Content
     * @constructor
     */
    function Content(data) {
        var that = this;
        var player = new Player();
        
        data = data || {};

        that.player = {};

        player.getInformations(function(error, player){
            if(!error)
                that.player = player;
        });

        that.types = ['main', 'layout'];

        if(!_global.Android){

            _global.Android = {
                ready : function(callback){ return callback },
                finish: function(){}
            }
        }
    }

    /**
     * [start description]
     * @param  {[type]}   data     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    Content.prototype.start = function _start(data, callback) {

        _global.getProjectJson = true;

        if(typeof data == 'function')
            callback = data

        if(typeof callback != 'function')
            callback = function(){};

        _global.Android.ready(callback);
    };

    /**
     * [finish description]
     * @param  {[type]}   data     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    Content.prototype.finish = function _finish(data, callback) {
        var nextContentUrl;

        try {
            _global.Android.finish();
        } catch(error) {
            nextContentUrl = this.player.api + '/next'
            console.error("Erro ao tentar finalizar o template, tentando realizar método alternativo", error);
        }

        Utils.request(nextContentUrl, function(error, data){
            console.log('Finish Content Alternative Method', error, data);
        });
    };

    /**
     * [scheduler description]
     * @param  {[type]}   data     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    Content.prototype.scheduler = function _scheduler(data, callback) {
       
        return this.get(url, callback);

    };

    
    
    _global.Content = Content;
})(this);

// content = new Content();

// content.start();

// setTimeout(function(){
//     content.finish();
// }, 5000)