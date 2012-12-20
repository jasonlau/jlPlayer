<!-- 
/* 
    jlPlayer - A jQuery plugin
    Requires jQuery 1.8.3+ AND jQuery UI 1.9.1+
    ==================================================================
    ©2012 JasonLau.biz - Version 1.0.7
    
    Documentation: http://jasonlau.biz/home/jquery/jlplayer
    Download: https://github.com/jasonlau/jlPlayer
    Demo: http://jasonlau.biz/home/jlplayer-demo
    
    ==================================================================
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    HTML TEMPLATE:
    
    <html>
    <head>
    <title>jlPlayer Template</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
    <link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/themes/base/jquery-ui.css" rel="stylesheet" type="text/css" />
    <script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
    <script type="text/javascript" src="jlplayer.js"></script>
    <script type="text/javascript">
    jQuery(document).ready(function($){
        $(".playlist").jlplayer({
             volume: 100,
             auto_start: false,
             loop: true,
             shuffle: false,
             auto_advance: true,
             class_active_song: 'ui-state-highlight',
             class_inactive_song: 'ui-state-default',
             class_song_hover: 'ui-state-hover',
             class_play_button: 'ui-state-default',
             class_next_button: 'ui-state-default',
             class_prev_button: 'ui-state-default',
             class_progress_range: 'ui-state-error',
             class_progress_bar: 'ui-state-highlight',
             class_progress_handle: 'ui-state-default',
             class_volume_range: 'ui-state-default',
             class_volume_bar: 'ui-widget-content',
             class_volume_handle: 'ui-state-default',
             class_song_list: 'ui-widget-content',
             class_song_info: 'ui-widget-content',
             display_source_links: true
        });
    });
    </script>
    </head>
    <body>
<!-- BEGIN PLAYLIST -->
<ul class="playlist">
  <!-- BEGIN SONG -->
  <li>
    <h3>{Song Title 1}</h3>
    <p>{Song 1 information/description}</p>
    <a href="{OGG Source URL}">ogg</a> <a href="{MP3 Source URL}">mp3</a>
  </li>
  <!-- END SONG -->
  <!-- BEGIN SONG -->
  <li>
    <h3>{Song Title 2}</h3>
    <p>{Song 2 information/description}</p>
    <a href="{OGG Source URL}">ogg</a> <a href="{MP3 Source URL}">mp3</a>
  </li>
  <!-- END SONG -->
  <!-- BEGIN SONG -->
  <li>
    <h3>{Song Title 3}</h3>
    <p>{Song 3 information/description}</p>
    <a href="{OGG Source URL}">ogg</a> <a href="{MP3 Source URL}">mp3</a>
  </li>
  <!-- END SONG -->
</ul>
<!-- END PLAYLIST -->
    </body>
    </html>
    
*/

(function($){
 	$.fn.extend({ 
 		jlplayer: function(options) {
			var defaults = {
			 /* Default volume */
             volume: 100,
             
             /* Start playing when the player loads. */ 
             auto_start: false,
             
             /* Continuous play. Replay the playlist when it completes. */ 
             loop: false,
             
             /* Shuffle the playlist items when the player loads. */
             shuffle: false,
             
             /* Automatically advance to the next playlist item. */
             auto_advance: true,
             
             /* Display the volume controls. */
             volume_control: true,
             
             /* Display the progress bar. */
             progress_bar: true,
             
             /* Display the >> button. */
             button_next: true,
             
             /* Display the << button. */
             button_prev: true,
             
             /* Display the songlist */
             song_list: true,
             
             /* Hides the song info until the song is selected. */
             hide_song_info: true,
             
             /* Default CSS classes for objects and states. */
             class_player_wrapper: 'ui-widget-content ui-corner-all',
             class_active_song: 'ui-state-highlight ui-corner-all',
             class_inactive_song: 'ui-state-default ui-corner-all',
             class_song_hover: 'ui-state-hover ui-corner-all',
             class_play_button: 'ui-state-default ui-corner-all',
             class_next_button: 'ui-state-default ui-corner-all',
             class_prev_button: 'ui-state-default ui-corner-all',
             class_progress_range: 'ui-state-error ui-corner-all',
             class_progress_bar: 'ui-state-highlight ui-corner-all',
             class_progress_handle: 'ui-state-default',
             class_volume_range: 'ui-state-default ui-corner-all',
             class_volume_bar: 'ui-widget-content ui-corner-all',
             class_volume_handle: 'ui-state-default',
             class_song_list: 'ui-widget-content ui-corner-all',
             class_song_info: 'ui-widget-content ui-corner-all',            
             
             /* Display a link for each source in the song list. */
             display_source_links: true,
             
             /* Effect to use when the player is initially displayed. */
             /*  blind, bounce, clip, drop, explode, fold, highlight, puff, pulsate, scale, shake, size, slide */
             show_effect: 'fade',
             
             /* Options for this effect. Refer to jQuery UI documentation. http://jqueryui.com/effect/#default */
             effect_options: {},
             
             /* Effect duration. */
             show_duration: 1000,
             
             /* A callback function to run when the player first loads. */
             is_loaded: function(){ try{ console.log('Player is ready.'); }catch(e){} },
             
             /* Keep it unique! */
             player_id: 'jlplayer-' + Math.floor(Math.random()*100) 
			}
				
			var option =  $.extend(defaults, options);
            var obj = $(this),
            songs = obj.find('li');

    		return this.each(function() {
    		  /* Check if HTML5 audio tag is supported. */
              if(typeof Audio=='function' || typeof Audio=='object'){
              
              /* Set the player state, update play icon data */
              function set_player_state(state){
                var play_icon = $('.' + option.player_id + '-playpausebutton-icon');
                player_state = state;
                
                switch(player_state){
                    case 'play':
                    /* This is confusing - when the player state is "play", the icon mode is "pause". */
                    play_icon.data({'mode':'pause'}).attr({'title':'Pause'});
                    play_icon.toggleClass('ui-icon-pause', true);
                     $('.' + option.player_id + '-song').toggleClass(option.player_id + '-song-active ' + option.class_active_song, false).toggleClass(option.player_id + '-song-inactive ' + option.class_inactive_song, true);
                    $('.' + option.player_id + '-song-' + current_index).toggleClass(option.player_id + '-song-active ' + option.class_active_song, true).toggleClass(option.player_id + '-song-inactive ' + option.class_inactive_song, false);
                    
                    /* Hide the previous song info if it is visible. */
                    $('.' + option.player_id + '-song-inactive p').not(':hidden').hide('slow');
                    
                    /* Show the song info if it is hidden. */
                    if(option.hide_song_info){
                        $('.' + option.player_id + '-song-' + current_index + ' p').not(':visible').show('slow');
                    }
                    
                    /* This is the play command for the audio tag. */
                    audio_player_dom.play();
                    break;
                    
                    case 'pause':
                    /* More confusion - when the player state is "pause", the icon mode is "play". */
                    play_icon.data({'mode':'play'}).attr({'title':'Play'});
                    play_icon.toggleClass('ui-icon-pause', false);
                    /* This is the pause command for the audio tag. */
                    audio_player_dom.pause();
                    break;
                    
                    case 'load':
                    /* Sets the icon mode to "play" initially. */
                    play_icon.data({'mode':'play'}).attr({'title':'Play'});
                    /* 
                    This is the load command for the audio tag. Not to be confused with jQuery's "load()"                            method. This is why we reference the DOM object with javascript instead. 
                    */
                    audio_player_dom.load();
                    break;
                    
                    case 'idle':
                    audio_player_dom.currentTime = 0;
                    play_song(0);
                    $('.' + option.player_id + '-progressbar').slider('value', 0);
                    $('.' + option.player_id + '-song').toggleClass(option.player_id + '-song-active ' + option.class_active_song, false).toggleClass(option.player_id + '-song-inactive ' + option.class_inactive_song, true);
                    set_player_state('pause');
                    break;
                }
              };
              
              /* Load or play a playlist item */
              function play_song(new_index){
                /* Check if the index number has changed. */
                if(new_index != current_index){
                    /* Yes, the index number has changed. Load the new selection. */
                    audio_sources = '';
                    /* Loop through the playlist items and grab the new selection. */
                    $(songs).each(function(index, value){
                        if(index == new_index){
                            var song = $(this),
                                info = song.find('p').html(),
                                sources = song.find('a');
                            $('.' + option.player_id + '-song-info').html(info);
                            /* Loop through the souces and assemble the source tags for the audio tag. */
                            $(sources).each(function(){
                                var _source = $(this),
                                file_url = _source.attr('href'),
                                mime_type = 'audio/' + _source.html();
                                /* Add new source links to existing source tags. */
                                $("source[type='" + mime_type + "']").attr({'src': file_url }).data({'parent': new_index});                               
                            });
                        }
                    });
                    /* Set the global current_index to the new selection. */                   
                    current_index = new_index;
                    /* Load the new selection. */
                    set_player_state('load');
                }
                
                /* Play the new selection and update the player state. */
                set_player_state('play');                                                                       
              }
              
              /* Update the progress bar. */
              function update_progress(){
                var dur = audio_player_dom.duration,
                time = audio_player_dom.currentTime,
                fraction = time/dur,
                percent = (isNaN(fraction*100)) ? 0 : (fraction*100),
                icon = $('.' + option.player_id + '-playpausebutton-icon');
                $('.' + option.player_id + '-progressbar').slider('value', percent);
              }
              
              /* Set the player volume. */
               function set_volume(new_value){
                var new_volume = new_value/100;
                audio_player_dom.volume = new_volume;
                $('.' + option.player_id + '-volumebar').slider('value', new_volume);                
              }
              
              /* Setup the progress bar. */
              function progressbar_init(){
                $('div.' + option.player_id + '-progressbar').slider({
                orientation: "horizontal",
                range: "min",
                min: 0,
                max: 100,
                animate: true,
                value: 0,
                step: .1,
                /* This is called while the user is dragging the handle. */
                slide: function( event, ui ) {                   
                    if(isSeekable){
                        /* If we can seek, pause the player during the seeking. */
                      audio_player_dom.pause();  
                    }  else {
                        /* Seeking is not supported. Display a message during seeking. */
                       $('.' + option.player_id + '-progress-icon').attr('title','Seeking not supported!');
                       $('.' + option.player_id + '-progress-icon').toggleClass('ui-icon-alert', true);
                       $('.' + option.player_id + '-progress-icon').toggleClass('ui-icon-arrowthick-2-e-w', false); 
                    }                                                       
                },
                /* The user finished dragging the handle. */
                stop: function( event, ui ) {                    
                    if(isSeekable){
                        /* 
                        Seeking is supported, set the current time for the audio player to the new value and                             resume playback. 
                        */
                        audio_player_dom.currentTime = ui.value;
                        audio_player_dom.play();
                    } else {
                        /* Seeking is not supported. Return the icon to it's normal state after dragging. */
                       $('.' + option.player_id + '-progress-icon').toggleClass('ui-icon-alert', false);
                       $('.' + option.player_id + '-progress-icon').toggleClass('ui-icon-arrowthick-2-e-w', true);
                       $('.' + option.player_id + '-progress-icon').attr('title','Seeking not supported!'); 
                    }                                       
                }
                });
              }
              
              function generate_player_html(which){
                which = (!which) ? 'player' : which;
                /* Assemble the HTML for the player user interface. */
                var audio_tag = '<audio id="' + option.player_id + '_audio" class="' + option.player_id + '-audio">',
                player_html = '<div class="' + option.player_id + '-wrapper ' + option.class_player_wrapper + '" style="display:none;">'
                + '<div class="' + option.player_id + '-progressbar"></div>'
                + '<div class="' + option.player_id + '-button ' + option.player_id + '-playpausebutton ' + option.class_play_button + '" data-mode="play"><div class="' + option.player_id + '-playpausebutton-icon ui-icon ui-icon-play" title="Play"></div></div>'
                + '<div class="' + option.player_id + '-button ' + option.player_id + '-nextbutton ' + option.class_next_button + '"><div class="ui-icon ui-icon-seek-next" title="Next"></div></div>'
                + '<div class="' + option.player_id + '-button ' + option.player_id + '-prevbutton ' + option.class_prev_button + '"><div class="ui-icon ui-icon-seek-prev" title="Previous"></div></div>'
                + '<div class="' + option.player_id + '-volumebar"></div>'
                + '<div class="' + option.player_id + '-songlist ' + option.class_song_list + '">';
                
                /* Loop through the playlist items and grab the data for each one. */
                $(songs).each(function(song_index, song){
                    var $_this = $(this),
                    title = $_this.find('h3').html(),
                    info = $_this.find('p').html(),
                    sources = $_this.find('a');
                    player_html += '<div class="' + option.player_id + ' ' + option.player_id + '-song ' + option.player_id + '-song-inactive ' + option.player_id + '-song-' + song_index +  ' ' + option.class_inactive_song + '" data-index="' + song_index +  '"><h3>' + title + '</h3><p>' + info + '<br />';
                    
                    /* Loop through the sources items and grab the data for each one. */
                    $(sources).each(function(source_index, value){
                        var _this = $(this),
                        mime_type = _this.html(),
                        selection = (song_index+1);
                        if(song_index == 0){
                           audio_tag += '<source class="' + option.player_id + '" src="' + _this.attr('href') + '" type="audio/' + mime_type + '" data-parent="' + selection + '">'; 
                        }
                        /* Display direct links to the source files. */
                        if(option.display_source_links){
                            player_html += '[<a href="' + _this.attr('href') + '" data-type="' + mime_type + '">' + mime_type + '</a>] ';
                        }                      
                    });
                    
                    player_html += '</p></div>';                    
                  });
               player_html += '</div>';
               audio_tag += '</audio>';
               switch (which){
                case 'audio':
                return audio_tag;
                break;
                
                default :
                return player_html;
                }
              }
              
              /* Setup the volume control. */
                function volumebar_init(){
                    $('.' + option.player_id + '-volumebar').slider({
                        orientation: "horizontal",
                        value: 1,
                        min: 0,
                        max: 1,
                        range: 'min',
                        animate: true,
                        step: .1,
                        /* The user is dragging the handle. */
                        slide: function( event, ui ) {
                            /* Set the volume for the audio player. */
                            audio_player_dom.volume = ui.value;
                            /* Check if the player is muted and update the icon data accordingly. */
                            if(ui.value <= 0){
                                $('.' + option.player_id + '-volume-icon').toggleClass('ui-icon-volume-off', true);
                                $('.' + option.player_id + '-volume-icon').toggleClass('ui-icon-volume-on', false)
                                .attr('title','Muted');
                            } else {
                                $('.' + option.player_id + '-volume-icon').toggleClass('ui-icon-volume-off', false);
                                $('.' + option.player_id + '-volume-icon').toggleClass('ui-icon-volume-on', true)
                                .attr('title','Volume ' + (ui.value*100) + '%');
                            }
                        }
                    });
                }
                
                /* Check options for which objects to hide. */
                function check_visibility_options(){
                    /* Check options for which objects to hide. */
                    if(!option.volume_control){
                        $('.' + option.player_id + '-volumebar').css({'display':'none'});
                    }
                    
                    if(!option.progress_bar){
                        $('.' + option.player_id + '-progressbar').css({'display':'none'});
                    }
                    
                    if(!option.button_next){
                        $('.' + option.player_id + '-nextbutton').css({'display':'none'});
                    }
                    
                    if(!option.button_prev){
                        $('.' + option.player_id + '-prevbutton').css({'display':'none'});
                    }
                    
                    if(!option.song_list){
                        $('.' + option.player_id + '-songlist').css({'display':'none'});
                    }
                    
                    if(option.hide_song_info){
                        $('.' + option.player_id + '-songlist p').css({'display':'none'});
                        $('.' + option.player_id + '-song').hover(function(){
                            $(this).find('p').clearQueue().stop().show('slow');
                        },function(){
                            $(this).find('p').hide('slow');
                        });
                    }
                }
                
                /* Insert icons in the sliders handles. */
                function add_slider_handle_icons(){
                    /* Insert an icon in the progress bar handle. */
                    $('.' + option.player_id + '-progressbar .ui-slider-handle').append('<div class="ui-icon ui-icon-arrowthick-2-e-w ' + option.player_id + '-progress-icon" style="margin:2px 2px 2px 2px;"></div>');
                    /* Insert an icon in the volume bar handle. */
                    $('.' + option.player_id + '-volumebar .ui-slider-handle').append('<div class="ui-icon ui-icon-volume-on ' + option.player_id + '-volume-icon" title="Volume" style="margin:2px 2px 2px 2px;"></div>');
                }
                
                function add_player_listeners(){
                    /* Add a listener so we know when the song is over. */
                    audio_player_dom.addEventListener('ended', function() {
                        if(option.auto_advance || option.loop){
                            /* Auto advance is on - go to the next selection by triggering the click even on the >> button */
                            if((current_index >= songs.length-1) && option.loop){
                                $('.' + option.player_id + '-nextbutton').trigger('click');
                            } else if((current_index < (songs.length-1)) && option.auto_advance){
                                $('.' + option.player_id + '-nextbutton').trigger('click');
                            } else if((current_index >= (songs.length-1)) && option.auto_advance){
                                set_player_state('idle');
                            } else {
                                /* Auto advance is off - set the progress back to zero and pause the player. */
                                set_player_state('idle');
                            }
                        }
                    });
                    
                    /*
                    Add a listener so we know when the song is playing.
                    This is where the progress bar gets updated.
                    */
                    audio_player_dom.addEventListener('timeupdate', function() {
                        update_progress();
                    }, false);
                }
                
                function set_mouse_events(){
                    /* Set the click event for the play button. */
                    $('.' + option.player_id + '-playpausebutton').bind('click',function(){
                        /* Check the global player state and act accordingly. */
                        switch(player_state){
                            case 'play':
                            set_player_state('pause');
                            break;
                            
                            default:
                            play_song(current_index);
                        }
                    });
                    
                    /* Set the click event for the >> button. */
                    $('.' + option.player_id + '-nextbutton').bind('click',function(){
                        var i = current_index,
                        next = ((i+1) > songs.length-1) ? 0 : (i+1);
                        play_song(next);
                    });
                    
                    /* Set the click event for the << button. */
                    $('.' + option.player_id + '-prevbutton').bind('click',function(){
                        var i = current_index,
                        prev = ((i-1) <= 0) ? 0 : (i-1);
                        play_song(prev);
                    });
                    
                    /* Set the mouseover and click events for the playlist items, and the cursor style. */
                    $('.' + option.player_id + '-song').hover(function(){
                        $(this).toggleClass(option.class_song_hover, true);
                    },function(){
                        $(this).toggleClass(option.class_song_hover, false);
                    }).click(function(){
                        var new_index = $(this).data().index;
                        play_song(new_index);
                    }).css({'cursor': 'pointer'});
                }
                
                function set_player_styles(){
                    /* Add custom css class options, if they exist, to their respective objects.  */
                    $('.' + option.player_id + '-progressbar').addClass(option.class_progress_bar);
                    $('.' + option.player_id + '-progressbar.ui-slider-range').addClass(option.class_progress_range);
                    $('.' + option.player_id + '-progressbar.ui-slider-handle').addClass(option.class_progress_handle);
                    $('.' + option.player_id + '-volumebar').addClass(option.class_volume_bar);
                    $('.' + option.player_id + '-volumebar.ui-slider-range').addClass(option.class_volume_range);
                    $('.' + option.player_id + '-volumebar.ui-slider-handle').addClass(option.class_volume_handle);
                    /* Set the cursor style. */
                     $('.ui-slider-handle, .' + option.player_id + '-button').css({'cursor':'pointer'});
                }
              
              /* HTML5 audio tag supported. */
              var current_index = 0,
              audio_sources = '',
              player_state = '';
              
              /* Shuffle the playlist if shuffle is selected */
              if(option.shuffle){
                songs.sort(function() { return 0.5 - Math.random() });                
              }
              
              /* Inject the new player HTML. */
               obj.replaceWith(generate_player_html() + generate_player_html('audio'));
               
               /* jQuery doesn't recognize HTML5 audio methods, so we have to reference the DOM object also. */
               var audio_player_dom = document.getElementById('' + option.player_id + '_audio'),
               audio_player = $('#' + option.player_id + '_audio'),
               /* Server must support partial data delivery for seek. */
               isSeekable = audio_player_dom.seekable && audio_player_dom.seekable.length > 0;
                 
               /* Set the progress bar. */
               progressbar_init();
               
               /* Setup the volume control. */
               volumebar_init();
               
               /* Set the initial volume. */
               set_volume(option.volume);
               
                /* Add event listeners for the audio object */
               add_player_listeners();              
               
               /* Set the mouse events for all buttons. */
               set_mouse_events();
               
               /* Insert icons in the sliders handles. */
               add_slider_handle_icons();
               
               /* Add custom classes and cursor styles. */
               set_player_styles();
               
               /* Check options for which objects to hide. */
               check_visibility_options(); 
               
               /* Everything is loaded - show the player. */
               $('.' + option.player_id + '-wrapper').show(option.show_effect, option.effect_options, option.show_duration, option.is_loaded);
                
               /* Start playing if auto_start is selected. */
               if(option.auto_start){
                $('.' + option.player_id + '-playpausebutton').trigger('click');
               }
                             
              } else {
                /* HTML5 audio tag not supported. We better get outta here! */
                return;
              }
               
    		}); /* end each */
    	}
	});
	
})(jQuery);
 -->