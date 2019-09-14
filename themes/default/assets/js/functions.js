function loadScript(src, callback){
	var s,
		r,
		t;
	r = false;
	s = document.createElement('script');
	s.type = 'text/javascript';
	s.src = src;
	s.onload = s.onreadystatechange = function() {
	if ( !r && (!this.readyState || this.readyState == 'complete') )
	{
		r = true;
		callback();
	}
	};
	t = document.getElementsByTagName('script')[0];
	t.parentNode.insertBefore(s, t);
}

function logout(){
	document.cookie = 'JWT=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
	window.location = window.site_url;
}

function verify_email_code( thisx ){
    var vl = $(thisx);
    $.get( window.ajax + 'useractions/get_email_verification_code', function(data, status){
        if( data.status == 200 ){
            if( vl.val() == data.code ){
                var data = {
                    'verified': '1',
                    'active': '1',
                    'start_up': '3'
                };

                $.get( window.ajax + 'profile/set_data', data );

                setTimeout(function(){
                    window.location = window.site_url;
                }, 1000);

            }else{
                M.toast({html: "Wrong verification email code, try again later."});
                vl.focus();
            }
        }else{
            M.toast({html: "Wrong verification email code, try again later."});
        }
    });
}

function verify_sms_code( thisx ){
    var vl = $(thisx);
    $.get( window.ajax + 'useractions/get_sms_verification_code', function(data, status){
        if( data.status == 200 ){
            if( vl.val() == data.code ){

                var data = {
                    'verified': 1,
                    'phone_verified': 1,
                    'start_up': 3
                };

                $.get( window.ajax + 'profile/set_data', data );

                setTimeout(function(){
                    window.location = window.site_url;
                }, 1000);

            }else{
                M.toast({html: "Wrong verification sms code, try again later."});
                vl.val('');
                vl.focus();
            }
        }else{
            M.toast({html: "Wronge verification sms code, try again later."});
        }
    });
}

function callback_open_gift_model( data ){
    if( data.status == 200 ){
        $('#modal_gifts').modal({
            onOpenEnd: function(){
                $('#gifts_container').html(data.gifts);
            },
            onCloseEnd: function(){

            }
        }).modal("open");
    }else{
        M.toast({html: data.message});
    }
}

function callback_like( data ){
	if( data.status == 200 ){
		$( '.dislike_text' ).html( data.dislike_text );
        $( '#like_btn' ).attr( 'data-ajax-post','/useractions/remove_like');
        $( '#like_btn' ).attr( 'data-ajax-callback','callback_remove_like');
        $( '#dislike_btn' ).attr( 'data-ajax-post','/useractions/dislike');
        $( '#dislike_btn' ).attr( 'data-ajax-callback','callback_dislike');
		$( '.like_text' ).html( data.like_text );
        $( '#like_btn' ).attr( 'data-replace-text', data.liked_text );
        $( '.like_text' + data.userid ).html( data.like_text );
        $( '.like_text' + data.userid ).parent().attr('disabled',true);
        if($( '.random_user_item').length == 0 ){
		    $('#btn_load_more_random_users').trigger('click');
        }
	}else{
		M.toast({html: data.message});
	}
}

function callback_like_interest( data ){
    if( data.status == 200 ){
        $( '.dislike_text' ).html( data.dislike_text );
        $( '#like_btn'+ data.userid  ).attr( 'data-ajax-post','/useractions/remove_like');
        $( '#like_btn'+ data.userid  ).attr( 'data-ajax-callback','callback_remove_like_interest');
        $( '.like_text'+ data.userid ).html( data.like_text );
    }else{
        M.toast({html: data.message});
    }
}

function callback_remove_like_interest( data ){
    if( data.status == 200 ){
        $( '#like_btn'+ data.userid ).attr( 'data-ajax-post','/useractions/like');
        $( '#like_btn'+ data.userid ).attr( 'data-ajax-callback','callback_like_interest');
        $( '.like_text'+ data.userid ).html( data.like_text );
    }else{
        M.toast({html: data.message});
    }
}

function callback_like_matches( data ){
    if( data.status == 200 ){
        $( '.dislike_text' ).html( data.dislike_text );
        $( '#like_btn'+ data.userid  ).attr( 'data-ajax-post','/useractions/remove_like');
        $( '#like_btn'+ data.userid  ).attr( 'data-ajax-callback','callback_remove_like_matches');
        $( '.like_text'+ data.userid ).html( data.like_text );
    }else{
        M.toast({html: data.message});
    }
}

function callback_unmatches( data ){
    if( data.status == 200 ){
        $('.match-page[data-matches-page-uid="'+data.userid+'"]').remove();
        if( $('.match-page[data-matches-page-uid]').length === 0 ){
            $('#matches_container').html('<h5 class="empty_state"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9,4A4,4 0 0,1 13,8A4,4 0 0,1 9,12A4,4 0 0,1 5,8A4,4 0 0,1 9,4M9,6A2,2 0 0,0 7,8A2,2 0 0,0 9,10A2,2 0 0,0 11,8A2,2 0 0,0 9,6M9,13C11.67,13 17,14.34 17,17V20H1V17C1,14.34 6.33,13 9,13M9,14.9C6.03,14.9 2.9,16.36 2.9,17V18.1H15.1V17C15.1,16.36 11.97,14.9 9,14.9M15,4A4,4 0 0,1 19,8A4,4 0 0,1 15,12C14.53,12 14.08,11.92 13.67,11.77C14.5,10.74 15,9.43 15,8C15,6.57 14.5,5.26 13.67,4.23C14.08,4.08 14.53,4 15,4M23,17V20H19V16.5C19,15.25 18.24,14.1 16.97,13.18C19.68,13.62 23,14.9 23,17Z"></path></svg>'+$('#matches_container').attr('data-nomore')+'</h5>');
            $('#btn_load_more_matches').remove();
        }
    }else{
        M.toast({html: data.message});
    }
}

function callback_remove_like_matches( data ){
    if( data.status == 200 ){
        $( '#like_btn'+ data.userid ).attr( 'data-ajax-post','/useractions/like');
        $( '#like_btn'+ data.userid ).attr( 'data-ajax-callback','callback_like_matches');
        $( '.like_text'+ data.userid ).html( data.like_text );
    }else{
        M.toast({html: data.message});
    }
}

function callback_remove_like( data ){
    if( data.status == 200 ){
        $( '#like_btn' ).attr( 'data-ajax-post','/useractions/like');
        $( '#like_btn' ).attr( 'data-ajax-callback','callback_like');
        $( '.like_text' ).html( data.like_text );
    }else{
        M.toast({html: data.message});
    }
}

function callback_liked_remove_like( data ){
    if( data.status == 200 ){
        $('[data-liked-uid="'+data.userid+'"]').remove();
    }else{
        M.toast({html: data.message});
    }
}

function callback_dislike( data ){
	if( data.status == 200 ){
		$( '.like_text' ).html( data.like_text );
        $( '#dislike_btn' ).attr( 'data-ajax-post','/useractions/remove_dislike');
        $( '#dislike_btn' ).attr( 'data-ajax-callback','callback_remove_dislike');
        $( '#like_btn' ).attr( 'data-ajax-post','/useractions/like');
        $( '#like_btn' ).attr( 'data-ajax-callback','callback_like');
        $( '#dislike_btn' ).attr( 'data-replace-text', data.disliked_text );
		$( '.dislike_text' ).html( data.dislike_text );
        $( '._dislike_text' + data.userid ).attr('disabled',true);
        if($( '.random_user_item').length == 0 ){
            $('#btn_load_more_random_users').trigger('click');
        }
	}else{
		M.toast({html: data.message});
	}
}

function callback_remove_dislike( data ){
    if( data.status == 200 ){
        $( '#dislike_btn' ).attr( 'data-ajax-post','/useractions/dislike');
        $( '#dislike_btn' ).attr( 'data-ajax-callback','callback_dislike');
        $( '.dislike_text' ).html( data.dislike_text );
    }else{
        M.toast({html: data.message});
    }
}

function callback_disliked_remove_dislike( data ){
    if( data.status == 200 ){
        $('[data-disliked-uid="'+data.userid+'"]').remove();
    }else{
        M.toast({html: data.message});
    }
}

function callback_block( data ){
	if( data.status == 200 ){
		$( '.block_text' ).attr( 'data-ajax-post', '/useractions/unblock' );
		$( '.block_text' ).attr( 'data-ajax-callback', 'callback_unblock' );
        setTimeout(() => {
            $("#ajaxRedirect").attr("data-ajax", '/find-matches');
            $("#ajaxRedirect").click();
        }, 2500);
	}else{
		
	}
}

function callback_unblock( data ){
	if( data.status == 200 ){
		$( '.block_text' ).attr( 'data-ajax-post', '/useractions/block' );
		$( '.block_text' ).attr( 'data-ajax-callback', 'callback_block' );
	}else{
		
	}
}

function callback_unblock_hide( data ){
	if( data.status == 200 ){
		$( '#blocked_user_'+data.id ).fadeOut( "slow" );
		M.toast({html: data.message});
	}else{
		M.toast({html: data.message});
	}
}

function callback_report( data ){
	if( data.status == 200 ){
		$( '.report_text' ).attr( 'data-ajax-post', '/useractions/unreport' );
		$( '.report_text' ).attr( 'data-ajax-callback', 'callback_unreport' );
		$( '.report_text' ).html( data.report_text );
		M.toast({html: data.message});
	}else{
		M.toast({html: data.message});
	}
}

function callback_unreport( data ){
	if( data.status == 200 ){
        $( '.report_text' ).removeAttr( 'data-ajax-post' );
        $( '.report_text' ).removeAttr( 'data-ajax-callback' );
        $( '.report_text' ).removeAttr( 'data-ajax-params' );
		$( '.report_text' ).html( data.report_text );
        $( '.report_text' ).addClass('modal-trigger');
        $( '.report_text' ).attr('href','#modal_report');
		M.toast({html: data.message});
	}else{
		M.toast({html: data.message});
	}
}

function callback_show_notifications( data ) {
    $( '.dt_notifs' ).remove();
    if (data.status == 200) {
    	$( '.notification_badge' ).addClass('hide');
        $( '.dt_notifis_prnt' ).empty().html(data.notifications);
        $( '#notificationbtn' ).attr( 'data-ajax-params','seen=true');
    }
}

function callback_load_more_random_users( data ) {
    if( data.status == 200 ) {
        let button = $('#btn_load_more_random_users');
        let container = $('#random_users_container');
        let template = $('#random-user-item');
        init_load_more(data,button,container,template);
        if( $('.random_user_item').length == 0 ){
            $('#dt_ltst_users').remove();
        }
    }else{
        M.toast({html: data.message});
    }
}

function callback_load_more_likes_users( data ) {
    if( data.status == 200 ) {
        let button = $('#btn_load_more_likes_users');
        let container = $('#likes_users_container');
        let template = $('#likes-user-item');
        init_load_more(data,button,container,template);
    }else{
        M.toast({html: data.message});
    }
}

function callback_load_more_liked_users( data ) {
    if( data.status == 200 ) {
        let button = $('#btn_load_more_liked_users');
        let container = $('#liked_users_container');
        let template = $('#liked-user-item');
        init_load_more(data,button,container,template);
    }else{
        M.toast({html: data.message});
    }
}

function callback_load_more_disliked_users( data ) {
    if( data.status == 200 ) {
        let button = $('#btn_load_more_disliked_users');
        let container = $('#disliked_users_container');
        let template = $('#disliked-user-item');
        init_load_more(data,button,container,template);
    }else{
        M.toast({html: data.message});
    }
}

function callback_load_more_visits( data ) {
    if( data.status == 200 ) {
        let button = $('#btn_load_more_visits');
        let container = $('#visits_container');
        let template = $('#visits-item');
        init_load_more(data,button,container,template);
    }else{
        M.toast({html: data.message});
    }
}

function callback_load_more_interest( data ) {
    if( data.status == 200 ) {
        let button = $('#btn_load_more_interest');
        let container = $('#interest_container');
        let template = $('#interest-item');
        init_load_more(data,button,container,template);
    }else{
        M.toast({html: data.message});
    }
}

function callback_load_more_matches( data ) {
    if( data.status == 200 ) {
        let button = $('#btn_load_more_matches');
        let container = $('#matches_container');
        let template = $('#matches-item');
        init_load_more(data,button,container,template);
    }else{
        M.toast({html: data.message});
    }
}

function callback_load_more_search_users( result ) {

    var btn_text = $('#btn_load_more_search_users').html();
    $('#btn_load_more_search_users').removeAttr('data-ajax-params');
    $('#btn_load_more_search_users').css( {'display':'block'} ).show();
    $('#_load_more').remove();
    if (result.status == 200) {
        $('#dt_ltst_users').remove();
        $('.dt_home_match_user').remove();
        $('#latest_user').removeClass('hide');
        $('#home_filters_close').trigger('click');
        let button = $('#btn_load_more_search_users');
        let container = $('#search_users_container');
        let dtemplateHtml = '';
        let listHtml = '';

        button.removeClass('hide');
        let params = button.attr('data-ajax-params' );
        let search = result.page ;
        let replacement = "_where=" + encodeURI(result.post) +"&page=" + search;
        button.attr('data-ajax-params', replacement);
        if (result.html.length == 0) {
            if(container.html() == '' ){
                $('#search_users_container').html('<h5 class="empty_state">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">' +
                    '        <path fill="currentColor" d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21M19.75,3.19L18.33,4.61C20.04,6.3 21,8.6 21,11H23C23,8.07 21.84,5.25 19.75,3.19M1,11H3C3,8.6 3.96,6.3 5.67,4.61L4.25,3.19C2.16,5.25 1,8.07 1,11Z" /></svg> ' +
                    button.attr('data-lang-nomore') +
                    '</h5>');
                button.hide();
            }else{
                button.html(button.attr('data-lang-nomore'));
            }
        } else {
            button.html(button.attr('data-lang-more'));
            container.append(result.html);
        }
    } else{
        if(typeof data.message !== undefined) {
            M.toast({html: data.message});
        }
    }
}

function callback_load_more_match_users( data ) {
    let avaters_container = $('#avaters_item_container');
    let container = $('#match_item_container');
    let button = $('#btn_load_more_match_users');
        button.attr('data-ajax-params', 'page=' + data.page);
    if( data.status == 200 ) {
        if( data.html !== '' ){
            avaters_container.append(data.html_imgs);
            container.append(data.html);
            var matched = $(".usr_thumb");
            if( matched.length === 0 ) {
                console.log('defsddf');
            }
            $('.mtc_usrd_content').hide();
            $('.mtc_usrd_content:first').show();
            $('.usr_thumb:first').addClass('isActive');
            $('.usr_thumb').hide();
            $('.usr_thumb:lt(8)').show();

        }else{
            button.attr( 'data-ajax-post',null);
            button.attr( 'data-ajax-params',null);
            button.attr( 'data-ajax-callback',null);
            button.attr( 'disabled',true);
            button.css( {'text-transform':'initial'} );
            button.html( button.attr( 'data-lang-nomore') );
        }
    }
    return true;


    if( data.status == 200 ) {
        $('.mtc_usr_details').removeClass('hide');
        let button = $('#btn_load_more_match_users');
        let avaters_container = $('#avaters_item_container');
        let avaters_item_templates = $('#match-users-avaters-item');
        let avaters_itemtemplateHtml = avaters_item_templates.html().trim();
        let avaters_itemdtemplateHtml = '';
        let avaters_itemlistHtml = '';

        let container = $('#match_item_container');
        let template = $('#match-users-item');
        let templateHtml = template.html().trim();
        let dtemplateHtml = '';
        let listHtml = '';
        button.attr('data-ajax-params', 'page=' + data.page);
        if (data.list.length == 0) {
            button.attr( 'data-ajax-post',null);
            button.attr( 'data-ajax-params',null);
            button.attr( 'data-ajax-callback',null);
            button.attr( 'disabled',true);
            button.css( {'text-transform':'initial'} );
            button.html( button.attr( 'data-lang-nomore') );
        } else {
            let first = true;
            for (let key in data.list) {
                if (data.list.hasOwnProperty(key)) {
                    if( first ){
                        data.list[key].first = true;
                        first = false;
                    }else{
                        data.list[key].first = false;
                    }
                    avaters_itemdtemplateHtml = avaters_itemtemplateHtml.interpolate(data.list[key]);
                    dtemplateHtml = templateHtml.interpolate(data.list[key]);
                    avaters_itemlistHtml += avaters_itemdtemplateHtml;
                    listHtml += dtemplateHtml;
                }
            }
            avaters_container.append(avaters_itemlistHtml);
            container.append(listHtml);
            var matched = $(".usr_thumb");
            if( matched.length === 0 ) {
                console.log('defsddf');
            }
            $('.mtc_usrd_content').hide();
            $('.mtc_usrd_content:first').show();
            $('.usr_thumb:first').addClass('isActive');
            $('.usr_thumb').hide();
            $('.usr_thumb:lt(8)').show();
        }
        if( $('.mtc_usrd_content').length === 0 ){ $('#section_match_users').hide(); }else{ $('#section_match_users').show(); }

    }else{
        M.toast({html: data.message});
    }
}

function _startTimer(duration, display) {
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        diff = duration - (((Date.now() - start) / 1000) | 0);
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.html(minutes + ":" + seconds);
        if (diff <= 0) {
            start = Date.now() + 1000;
            display.parent().html(display.parent().attr('data-message-expire'));
        }
    };
    timer();
    window.tm = setInterval(timer, 1000);
}

function remove_conversationlist_active(){
    $('.m_con_item').removeClass('active');
}