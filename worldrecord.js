/**
 * worldrecord.js
 *
 *
 * Copyright (c) 2018 Joseph Read
 * 
 * LICENSE:
 * 
 * This library is free software; you can redistribute it
 * and/or modify it under the terms of the GNU Lesser General
 * Public License as published by the Free Software Foundation;
 * either version 2.1 of the License, or (at your option) any
 * later version.
 * 
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 *
 * @author     Joseph Read <itjoe@rockstaread2010.com>
 * @copyright  2018 Joseph Read
 * @license    http://www.opensource.org/licenses/lgpl-license.php LGPL
 * @link       https://rockstaread2010.com
 */

(function(){

        /*
            Load Global Variables
        */

        var streamGame = '';
        var gameID = '';
        var streamTitle = '';
        var categoryId = '';
        var worldrecordMessage = '';

        /*
            Get the Game Id from the Current Stream Game    
        */

        function findGameID(gamename){
           url_game = 'https://www.speedrun.com/api/v1/games?name=' + gamename;
           getGameData = $.customAPI.get(url_game).content;
           getGameDataJSON = JSON.parse(getGameData);

           gameID = getGameDataJSON.data[0].id;

        }

        /*
            Get the Category form the Current Steam title
        */

        function findCurrentCategory(gameId, streamTitle){
            url_current_game = 'https://www.speedrun.com/api/v1/games/' + gameId + '/categories'
            getCategory = $.customAPI.get(url_current_game).content;
            getCategoryJSON = JSON.parse(getCategory);

            for(var i = 0; i < getCategoryJSON.data.length; i++){
                findcat = streamTitle.includes(getCategoryJSON.data[i].name);
                if (findcat){
                    categoryId = getCategoryJSON.data[i].id;
                    //$.consoleLn(getCategoryJSON.data[i].name + " | " +categoryId);
                }
            }
        }

        /*
            Gets the World Record Holder and time with categoryID
        */

        function getWorldRecordHolder(categoryid){
            url_world_record_holder = 'https://www.speedrun.com/api/v1/categories/' + categoryid + '/records';
            getworldrecord = $.customAPI.get(url_world_record_holder).content;
            worldrecordJSON = JSON.parse(getworldrecord);

            userID = worldrecordJSON.data[0].runs[0].run.players[0].id;
            recordTime = worldrecordJSON.data[0].runs[0].run.times.realtime;

            //$.consoleLn(userID + ' ' + recordTime);

            url_get_username = 'https://www.speedrun.com/api/v1/users/' + userID;
            usernamedata = $.customAPI.get(url_get_username).content;
            usernameJSON = JSON.parse(usernamedata);

            realName = usernameJSON.data.names.international;

            //$.consoleLn(realName + ' ' + recordTime);

            recordTimeFix = recordTime.replace('PT', '');
            recordTimeFix = recordTimeFix.replace('H', ':');
            recordTimeFix = recordTimeFix.replace("M", ':');
            recordTimeFix = recordTimeFix.replace('S', '');

            worldrecordMessage = 'Current World Record Holder : ' + realName + ' with a time of ' + recordTimeFix;

        }

        /*
            Function to Call the World Record in Order
        */

        function getWR(){
            $.consoleLn('Loading World Record Data');
                findGameID(streamGame);               
                findCurrentCategory(gameID, streamTitle);
                getWorldRecordHolder(categoryId);

            if (worldrecordMessage == '') {
                $.consoleLn('Failed to collect World Record Data');
            }
            else{
                $.consoleLn('Sucessfully collected World Record Data');
            }
        }


    /*
        Fires when the stream comes online
        Reloads the World Record Data
    */

    $.bind('twitchOnline', function(event){
        streamGame = $.twitchcache.getGameTitle();
        streamTitle = $.twitchcache.getStreamStatus();
        getWR();
    });

    /*
        Fires when the stream game changes
        Reloads the World Record Data 
    */

    $.bind('twitchGameChange', function(event){
        streamGame = $.twitchcache.getGameTitle();
        streamTitle = $.twitchcache.getStreamStatus();
        getWR();
    });

    /*
        Fires when the stream title changes
        Reloads the World Record Data 
    */

    $.bind('twitchTitleChange', function(event){
        streamGame = $.twitchcache.getGameTitle();
        streamTitle = $.twitchcache.getStreamStatus();
        getWR();
    });

    /*
        Commands Handler
    */

    $.bind('command', function(event){

        var command = event.getCommand();
        var sender = event.getSender();
        var arguments = event.getArguments();
        var args = event.getArgs();

        if (command.equalsIgnoreCase('wr')) {
            if (args.length > 0) {       
                if (args[0].equalsIgnoreCase('game')) {
                    var argsmessage = '';
                    for (var i = 1; i < args.length; i++) {
                        argsmessage += args[i]  + ' ';
                    }
                    streamGame = argsmessage;
                    $.consoleLn(argsmessage);
                }  
                else if (args[0].equalsIgnoreCase('category')) {
                    var argsmessage = '';
                    for (var i = 1; i < args.length; i++) {
                        argsmessage += args[i] + ' ';
                    }
                    streamTitle = argsmessage;
                    $.consoleLn(argsmessage);
                }
            }
            else{                    
                if (worldrecordMessage == '') {
                    $.say('Error getting World Record Data [Is the stream offline?]');
                }
                else{
                    $.say(worldrecordMessage);            
                }                
            }

        }

        else if(command.equalsIgnoreCase('reloadwr')){
            getWR();
        }
    });

    /*
        Initial Script Initializer
    */

    $.bind('initReady', function(){
        if ($.bot.isModuleEnabled('./custom/worldrecord.js')) {

            streamGame = $.twitchcache.getGameTitle();
            streamTitle = $.twitchcache.getStreamStatus();

            getWR();

            $.registerChatCommand('./custom/worldrecord.js', 'wr', 7);
            $.registerChatCommand('./custom/worldrecord.js', 'reloadwr', 7);
        }
    });

})();