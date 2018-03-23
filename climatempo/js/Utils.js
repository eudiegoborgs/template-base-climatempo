(function(_global) {

    /**
     * Classe to implement utils functions to template
     *
     * @class Utils
     * @constructor
     */
    function Utils() {}

    Utils.request = function _request(url, callback) {
        
        if(!url || typeof url != 'string')
            return false;

        if(typeof callback != 'function')
            callback = function(){};

        this.get = function _get(url, callback){
            var request = new XMLHttpRequest();
            request.open('GET', url, true);

            request.onload = function() {
                if (this.status >= 200 && this.status < 400) {
                    var body;
                    try {
                        body = JSON.parse(this.response);
                    }catch(err) {
                        return callback(err, this.response, null);
                    }

                    return callback(null, body, this.body);
                } else {
                    return callback(this.status, null, null);
                }
            };

            request.onerror = function() {
                callback(this.status, null, null);
            };

            request.send();
        }

        this.post = function _post(url, data, callback){
            var message = 'Method Utils.request.post not implemented';
            console.error(message, url, data);
            callback(message);
        }

        return this.get(url, callback);

    };

    /**
     * Função responsável por fazer o parse dos dados da 
     * notícia passados como parâmetro através da chamada da url
     * 
     * @param  string queryString   String para parsear
     * @return string               String parseada
     */
    Utils.prototype.parseQueryString = function _parseQueryString (queryString) {

        if(typeof(queryString) != 'string')
            return queryString;

        if(queryString[0] == '?')
            queryString = queryString.substring(1, queryString.length);

        var params = {}, queries, temp, i, l;
        queries = queryString.split('&');

        for ( i = 0, l = queries.length; i < l; i++ ) {
            temp = queries[i].split('=');
            params[temp[0]] = temp[1];
        }

        return params;
    }


    /**
     * Método para garantir o parseamento das string "doidas" do manager
     * 
     * @param  string txtVar    String para ser parseada
     * @param  object mapObject Objeto passado como parâmetro recursivo
     */
    Utils.prototype.parseTxtVar = function _parseTxtVar(txtVar) {
        var mapObject = {};
        if (txtVar && txtVar.indexOf('%253D') >= 0) {
            txtVar = decodeURIComponent(decodeURIComponent(txtVar));
            var secondaryParams = this.parseQueryString(txtVar);
            for (var templateVar in secondaryParams) {
                if (secondaryParams.hasOwnProperty(templateVar)) {
                    mapObject[templateVar] = secondaryParams[templateVar].replace(/\+/g, " ").trim();
                }
            }
        }

        return mapObject;
    }

    _global.Utils = Utils;

})(this);

// utils = new Utils();