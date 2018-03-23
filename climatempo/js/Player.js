
(function(_global) {

    /**
     * Classe to implement 4YouSee Player HTML content communications
     *
     * @class Player
     * @constructor
     */
    function Player() {
        var that = this;

        this.getInformations(function(error, player){
            if(!error) {
                that.id = player.id || null ;
                that.url = player.url || null ;
                that.port = player.port || null;
                that.files = player.files || null;
                that.version = '1.0.0';
            }
        });

        if(!_global.Android){

            _global.Android = {
                ready : function(callback){ return callback },
                finish: function(){}
            }
        }
    }

    /**
     * [getInformations description]
     * @param  function  callback [description]
     * @return function  callback com object preenchido com as que carregou o template informações do player
     *
     *  { 
     *      "player": {
     *          "api": "/api/player",
     *          "player": "/[4YouSee] default_project/json/",
     *          "system": "windows|linux|android",
     *          "files": "/[4YouSee] default_project/json/ | /playlist/",
     *      }
     *  }
     * 
     */
    
    Player.prototype.getInformations = function _getPlayerInformation(callback) {
        var player = {
            api : "http://localhost:48567/api/player",
            files: '/[4YouSee] default_project/',
            system: 'windows',
            port: 80
        }

        if(_global.navigator.appVersion.match(/linux/i))
            player.system =  'linux';

        if(_global.navigator.appVersion.match(/windows/i))
            player.system =  'windows';

        if(_global.navigator.appVersion.match(/android/i)){
            player.system =  'android';
            player.files = '/playlist/';
        }


        Utils.request(player.api, function(error, data){
            if(!error) {
                player.id = data.player.id;
                player.url = data.player.url || null ;
            }

            callback(error, player);
        });
    }

    Player.prototype.getDynamicData = function _getDynamicData(dynamicDataId, callback) {

        if(typeof dynamicDataId == 'function') {
            callback = dynamicDataId;
            dynamicDataId = null;
        }

        if(typeof callback != 'function')
            callback = function() {};

        var url = this.files + '/json/' + 'rss.player.' + this.id + '.json'

        Utils.request(url, function(error, data){
            if(error)
                return callback(error, {});

            if(typeof data != 'object' || !'itens' in data)
                return callback(null, {});

            if(dynamicDataId) {
                var filteredData = [];
                data.itens.forEach(function(obj, i){
                    if(obj['fonte'] == dynamicDataId) {
                        filteredData.push(obj);
                    }
                });

                return callback(null, filteredData)
            }

            callback(error, data);
        });
    }

    _global.Player = Player;
})(this);