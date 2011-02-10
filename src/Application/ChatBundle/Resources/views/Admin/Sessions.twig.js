{% include "ChatBundle::DateToolkit.twig.js" %}
var SessionToolkit = {
    Visit: {
        _timeOut: null,
        loadTimeout : function() {
            SessionToolkit.Visit._timeOut = window.setTimeout(function() {
                window.clearTimeout(SessionToolkit.Visit._timeOut);
                SessionToolkit.Visit.refreshCurrentVisits();
            }, 10000);
        },
        refreshCurrentVisits:function() {
            jQuery('#currentVisits table tbody').html('');
            jQuery.ajax({
                type : "GET",
                url : "{{ path('sglc_admin_console_current_visits', {'_format': 'json'})}}",
                cache : false,
                dataType: 'json',
                success : function(json) {
                    SessionToolkit.Visit.loadTimeout();
                    jQuery('#currentVisits table tbody').html('');
                    jQuery.each(json, function(i, item) {
                        SessionToolkit.Visit.Item.draw(item);
                    });
                }
            });
        },
        Item: {
            draw:function(item){
                var row = document.createElement('tr');
                jQuery(document.createElement('td')).html(item.visitor.id + '('+item.visitor.visits+')').appendTo(row);
                jQuery(document.createElement('td')).html(item.localtime).appendTo(row);
                jQuery(document.createElement('td')).html(item.hostname).appendTo(row);
                jQuery(document.createElement('td')).html(item.createdAt).appendTo(row);
                jQuery(document.createElement('td')).html(item.duration).appendTo(row);
                jQuery(document.createElement('td')).html(item.visitor.languages).appendTo(row);
                jQuery(document.createElement('td')).html(item.visitor.agent).appendTo(row);
                jQuery(document.createElement('td')).append(jQuery(document.createElement('a')).attr({href: item.visitor.currentPage}).html(item.visitor.currentPage)).appendTo(row);
                jQuery(document.createElement('td')).append(jQuery(document.createElement('a')).attr({href: item.visitor.currentPage}).html(item.visitor.referer)).appendTo(row);
                jQuery('#currentVisits table tbody').append(row);
                SessionToolkit.Visit.Item.drawHits(item);
            },
            drawHits: function (item) {
                var row = document.createElement('tr');
                jQuery(row).attr({
                    valign: 'top'
                });


                jQuery(document.createElement('td'))
                .append(jQuery(document.createElement('a')).attr({
                    href: '#'
                }).html('Hits +/-').click(function(){
                    jQuery('#visit_' + item.id).toggle();
                    return false;
                })).appendTo(row);

                jQuery(document.createElement('td')).attr({
                    colspan: 8
                })
                
                // div created
                .append(jQuery(document.createElement('div')).attr({ 
                    id: 'visit_'+item.id
                })

                // hits table created
                .append(jQuery(document.createElement('table')).attr({ 
                    width: '100%',
                    cellpadding:0,
                    cellspacing:0,
                    border: 0
                }).css({
                    'background-color': '#EEE',
                    'color': '#000'
                }).append('<tr class="header"><td>Hit ID</td><td>Time</td><td>Duration</td><td>URL</td><td>Referrer</td></tr>'))).appendTo(row);

                // Hit row created
                jQuery.each(item.hits, function(j, item2){
                    jQuery(document.createElement('tr'))
                    .addClass(j % 2 == 0 ? 'td1' : '')
                    .append(jQuery(document.createElement('td')).html(item2.id))
                    .append(jQuery(document.createElement('td')).html(item2.createdAt))
                    .append(jQuery(document.createElement('td')).html(item2.duration))
                    .append(jQuery(document.createElement('td')).append(jQuery(document.createElement('a')).attr({href: item2.link}).html(item2.link)))
                    .append(jQuery(document.createElement('td')).append(jQuery(document.createElement('a')).attr({href: item2.referer}).html(item2.referer)))
                    .appendTo(jQuery(row).find('#visit_' + item.id + ' table'));
                });

                jQuery('#currentVisits table tbody').append(row);
                jQuery('#visit_' + item.id).toggle();
            }
        }
    },
    Request: {
        _timeOut: null,
        loadTimeout : function() {
            SessionToolkit.Request._timeOut = window.setTimeout(function() {
                window.clearTimeout(SessionToolkit.Request._timeOut);
                SessionToolkit.Request.refreshRequestedChats();
            }, 10000);
        },
        refreshRequestedChats : function() {
            jQuery.ajax({
                type : "GET",
                url : "{{ path('sglc_admin_console_requested_chats', {'_format': 'json'})}}",
                cache : false,
                dataType: 'json',
                success : function(json) {
                    jQuery('#requestChats table tbody').html('');
                    jQuery.each(json, function(i, item) {
                        var row = document.createElement('tr');
                        jQuery(row)
                        .append('<td>'+item.id+' - ' + item.status.name + '</td>')
                        .append('<td>'+item.visitor.id+' - '+item.visitor.name+'</td>')
                        .append('<td>'+item.visitor.email+'</td>')
                        .append('<td>'+item.question+'</td>')
                        .append('<td>'+item.time+'</td>')
                        .append('<td>'+item.duration+'</td>')
                        .append('<td>'+item.operator.name+'</td>')
                        ;
                        var actionsCell = document.createElement('td');
                        if (typeof(item.operator.id) == 'undefined' && (item.status.id != '{{constant("Application\\ChatBundle\\Document\\Session::STATUS_CANCELED")}}' && item.status.id != '{{constant("Application\\ChatBundle\\Document\\Session::STATUS_CLOSED")}}')) {
                            var _link1 = document.createElement('a');
                            jQuery(_link1).click(function(){
                                window.open("{{path('sglc_chat_accept', {'id': '__chatId__'})}}".replace('__chatId__', item.id),'livechat'+item.id,'width=700,height=575,toolbar=no,location=no');
                                return false;
                            }).html('Accept').attr('href', '#');
                            jQuery(actionsCell).append(_link1);
                        }

                        if (typeof(item.operator.id) != 'undefined' && item.status.id == '{{constant("Application\\ChatBundle\\Document\\Session::STATUS_IN_PROGRESS")}}') {
                            var _link2 = document.createElement('a');
                            jQuery(_link2).click(function(){
                                window.open("{{path('sglc_chat_load', {'id': '__chatId__'})}}".replace('__chatId__', item.id),'livechat'+item.id,'width=700,height=575,toolbar=no,location=no');
                                return false;
                            }).html('Reload').attr('href', '#');
                            jQuery(actionsCell).append(_link2);
                        }

                        if (item.status.id != '{{constant("Application\\ChatBundle\\Document\\Session::STATUS_CANCELED")}}' && item.status.id != '{{constant("Application\\ChatBundle\\Document\\Session::STATUS_CLOSED")}}') {
                            var _link3 = document.createElement('a');
                            jQuery(_link3).click(function(){
                                return confirm('Are you sure?');
                            }).html('Close').attr('href', "{{path('sglc_admin_console_close', {'id': '__chatId__'})}}".replace('__chatId__', item.id));


                            if (typeof(_link1) != 'undefined' || typeof(_link2) != 'undefined') {
                                jQuery(actionsCell).append('&nbsp;|&nbsp;');
                            }
                            jQuery(actionsCell).append(_link3);
                        }

                        jQuery(row).append(actionsCell);

                        jQuery('#requestChats table tbody').append(row);

                    });
                    jQuery('#requestChats table tbody tr:even').addClass('td1');
                    SessionToolkit.Request.loadTimeout();
                },
                error : function(XMLHttpRequest) {
                    if (XMLHttpRequest.status == 401) {
                        location.href = '{{ path("_security_login")}}';
                    } else {
                        loadTimeout();
                    }
                }
            });
        }
    }
};
jQuery('#currentVisits').ready(function(){
    SessionToolkit.Visit.refreshCurrentVisits();
});
SessionToolkit.Request.loadTimeout();
SessionToolkit.Visit.loadTimeout();
