(function($){
	$(function(){
		$('a[href*="#"].smooth').not('[href="#"]').not('[href="#0"]').on('click', function(event) {
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
                location.hostname == this.hostname
            ) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top - 40
                    }, 1000, function() {
                        var $target = $(target);
                        if ($target.is(":focus")) {
                            return false;
                        } else {
                            $target.attr('tabindex', '-1');
                        }
                    });
                }
            }
        });
		var pxScrolled = 200;
		$(window).scroll(function() {
			if ($(this).scrollTop() > pxScrolled) {
				$('.dt_to_top').css({'bottom': '32px'});
			} else {
				$('.dt_to_top').css({'bottom': '-64px'});
			}
		});
        $( document ).on( 'click', '.dt_to_top', function(e){
            e.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, 0);
        });
		var $ctr = $(".slider_container");
		$( document ).on( 'click', '#btn-upload-images', function(e){
			var id = $( this ).attr( 'data-selected' );
			if( id === '' ){
				$( '#modal_imgs_info' ).html( 'Please, choose profile image.' );
				return false;
			}else{
				$( this ).attr('disabled', false);
			}
			$.get( window.ajax + 'profile/set_avater', { id:id } );
			$.get( window.ajax + 'profile/set', { key:"start_up", value:"1" } );
			$('.header_user').find('img').attr( 'src', window.media_path + id );
			$('#modal_imgs').modal('close');
			$(this).text("Saving...").delay(100).queue(function(){
				$ctr.addClass("center slider-two-active").removeClass("full slider-one-active");
			});
			e.preventDefault();
		});


        $( document ).on( 'blur', '#mobile', function(e){
            e.preventDefault();
            let formData = new FormData();
            formData.append( 'phone_number', $(this).val() );

            if($('#mobile').val() !== '' ) {
                let url = window.ajax + '/useractions/check_phone_number';
                $.ajax({
                    url: url,
                    type: "POST",
                    async: false,
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    timeout: 60000,
                    dataType: false,
                    success: function (result) {
                        if (result.status == 200) {
                            if (result.message !== '') {
                                M.toast({html: result.message});
                                $('#mobile').val('');
                                $('#mobile').focus();
                                return false;
                            }
                        }
                    }
                });
            }
        });

		$( document ).on( 'click', '.second', function(e){
			var Height, HairColor, MobileNumber, Country, Gender, Birthdate,emailvalidation;
                emailvalidation = $( this ).attr( 'data-emailvalidation' );
				Height = $( '#height' ).val();
				HairColor = $( '#hair' ).val();
				MobileNumber = $( '#mobile' ).val();
				country_code = $( '#country' ).find(":selected").attr('data-code');
				Country = $( '#country' ).find(":selected").val();
				Gender = $( '#gender' ).val();
				Birthdate = $( '#birthdate' ).val();

			if( MobileNumber === "" ){
				M.toast({html: $( '#mobile' ).attr('data-errmsg')});
				$( '#mobile' ).focus();
				return false;
			}
            if( Country === "" ){
                M.toast({html: $( '#country' ).attr('data-errmsg') });
                $( '#country' ).focus();
                return false;
            }
            if( Birthdate === "" ){
                M.toast({html: $( '#birthdate' ).attr('data-errmsg')});
                $( '#birthdate' ).focus();
                return false;
            }

			var data = {
				'height': Height,
				'hair_color': HairColor,
				'phone_number': MobileNumber,
				'country': Country,
				'gender': Gender,
				'birthday': Birthdate,
				'start_up': 2
			};

			$.get( window.ajax + 'profile/set_data', data );

			$( '#country_arecode' ).html( "+" + $( '#country' ).find(":selected").attr('data-code') );
			$( '#areacode' ).attr( 'value', "+" + $( '#country' ).find(":selected").attr('data-code') );
			$( '#mobile_validate').attr( 'value', '+' + $( '#country' ).find(":selected").attr('data-code') + MobileNumber);

			$(this).text("Saving...").delay(100).queue(function(){
				$ctr.addClass("full slider-three-active").removeClass("center slider-two-active slider-one-active");

				if( emailvalidation == 0 ){
                    setTimeout(() => {
                        $("#ajaxRedirect").attr("data-ajax", '');
                        $("#ajaxRedirect").attr("data-ajax", '/find-matches');
                        $("#ajaxRedirect").click();
                    }, 2000);
                }
			});
			e.preventDefault();
		});
        $( '#image_holder' ).on( 'click', 'img.thumb-image', function(e){
			var id = $( this ).attr( 'id' );
			$("#image_holder").find( '.thumb-image' ).css({'border': 'inherit'});
			$( this ).css({'border': '2px solid #9C27B0'});
			$( '#btn-upload-images' ).attr( 'data-selected', id );
			$( '#btn-upload-images' ).attr( 'disabled', false);
			e.preventDefault();
		});
		$( document ).on( 'change', '#avatar_img', function(e){
			var countFiles = $(this)[0].files.length;
			var imgPath = $(this)[0].value;
			var extn = imgPath.substring(imgPath.lastIndexOf('.') + 1).toLowerCase();
			var image_holder = $("#image_holder");
			var attach = [];
			image_holder.empty();
			if(countFiles > 4) {
				M.toast({html: 'Please select Four Images only.'});
			} else if (extn == "gif" || extn == "png" || extn == "jpg" || extn == "jpeg") {
				if (typeof(FileReader) != "undefined") {
					var formData = new FormData();
					for (var i = 0; i < countFiles; i++) {
						attach[i] = i;
						var reader = new FileReader();
						reader.onload = function(e) {

						};
						reader.readAsDataURL($(this)[0].files[i]);
						formData.append("avaters"+i, $(this)[0].files[i],$(this)[0].files[i].value );
					}
					$('.count_imgs').text(countFiles);
					var bar = $('.determinate');
					var progress = $('.progress');
					var status = $('#status');
					$('#modal_imgs').modal('open');
					$.ajax({
						xhr: function() {
							var xhr = new window.XMLHttpRequest();
							xhr.upload.addEventListener("progress", function(evt){
								if (evt.lengthComputable) {
								  	var percentComplete = evt.loaded / evt.total;
								  		percentComplete = parseInt(percentComplete * 100);
								  		status.html( percentComplete + "%");
								  		bar.width(percentComplete + '%');
								  		if (percentComplete === 100) {
											bar.hide();
											progress.hide();
											status.hide();
											$( '.select_profile_image' ).show();
										}
								}
							}, false);
							return xhr;
						},
						url: window.ajax + 'profile/upload_avater',
						type: "POST",
						async: true,
						data: formData,
						cache: false,
						contentType: false,
						processData: false,
						timeout: 60000,
						dataType: false,
						success: function(result) {
							if( result.status == 200 ){
								$.each( result.files, function(i) {
									$("<img />", {
										"src": window.media_path + result.files[i],
										"id": result.files[i],
										"class": "thumb-image"
									}).appendTo(image_holder);
								})
								image_holder.show();

							}
						}
					});
				} else {
					M.toast({html: 'Please select only Images.'});
				}
			} else {
				M.toast({html: "This browser does not support FileReader."});
			}
		});
		$( document ).on( 'click', '#btn-upload-profile-images', function(e){
			$('#modal_profileimgs').modal('close');
			$("#ajaxRedirect").attr("data-ajax", '/' + window.loggedin_user);
			$("#ajaxRedirect").click();
			e.preventDefault();
		});
        $( document ).on( 'change', '#profileavatar_img', function(e){
            var countFiles = $(this)[0].files.length;
            var imgPath = $(this)[0].value;
            var extn = imgPath.substring(imgPath.lastIndexOf('.') + 1).toLowerCase();
            if(countFiles > 1) {
                M.toast({html: 'Please select one image only.'});
            } else if (extn == "gif" || extn == "png" || extn == "jpg" || extn == "jpeg") {
                var formData = new FormData();
                formData.append("avaters0", $(this)[0].files[0],$(this)[0].files[0].value );

                $( '.dt_avatar_progress' ).removeClass( 'hide' );
                $( '.avatar_imgstatus' ).removeClass( 'hide' );
                $.ajax({
                    xhr: function() {
                        var xhr = new window.XMLHttpRequest();
                        xhr.upload.addEventListener("progress", function(evt){
                            if (evt.lengthComputable) {

                                var percentComplete = evt.loaded / evt.total;
                                percentComplete = parseInt(percentComplete * 100);
                                $( '.avatar_imgdeterminate' ).css({'width': percentComplete + '%'});
                                if (percentComplete === 100) {
                                    $( '.dt_avatar_progress' ).addClass( 'hide' );
                                    $( '.avatar_imgstatus' ).addClass( 'hide' );
                                }
                            }
                        }, false);
                        return xhr;
                    },
                    url: window.ajax + 'profile/upload_avater',
                    type: "POST",
                    async: true,
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    timeout: 60000,
                    dataType: false,
                    success: function(result) {
                        if( result.status == 200 ){
                            $.each( result.files, function(i) {
                                $.get( window.ajax + 'profile/set_avater', { id: result.files[i] } );
                                $('.header_user').find('img').attr( 'src', window.media_path + result.files[i] );
                                $('.avatar').find('img').attr( 'src', window.media_path + result.files[i] );
                            });

                            setTimeout(() => {
                                $("#ajaxRedirect").attr("data-ajax", '/' + window.loggedin_user );
                                $("#ajaxRedirect").click();
                            }, 500);
                        }
                    }
                });

            }else{
                M.toast({html: 'Please select only Images.'});
			}
		});
        $( document ).on( 'change', '#admin_profileavatar_img', function(e){
			var user_id = $(this).attr( 'data-userid' );
			var user_name = $(this).attr( 'data-username' );
			var formData = new FormData();
				formData.append("avaters0", $(this)[0].files[0],$(this)[0].files[0].value );
				$( '.admin_avatar_imgprogress' ).removeClass( 'hide' );
				$( '.admin_avatar_imgstatus' ).removeClass( 'hide' );
			$.ajax({
				xhr: function() {
					var xhr = new window.XMLHttpRequest();
					xhr.upload.addEventListener("progress", function(evt){
						if (evt.lengthComputable) {

							var percentComplete = evt.loaded / evt.total;
								percentComplete = parseInt(percentComplete * 100);
								$( '.admin_avatar_imgdeterminate' ).css({'width': percentComplete + '%'});
								if (percentComplete === 100) {
									$( '.admin_avatar_imgprogress' ).addClass( 'hide' );
									$( '.admin_avatar_imgstatus' ).addClass( 'hide' );
								}
						}
					}, false);
					return xhr;
				},
				url: window.ajax + 'profile/upload_avater',
				type: "POST",
				async: true,
				data: formData,
				cache: false,
				contentType: false,
				processData: false,
				timeout: 60000,
				dataType: false,
				success: function(result) {
					if( result.status == 200 ){
						$.each( result.files, function(i) {
							$.get( window.ajax + 'profile/set_user_avater', { userid: user_id , id: result.files[i] } );
							$('.avatar').find('img').attr( 'src', window.media_path + result.files[i] );
						})
						setTimeout(() => {
							$("#ajaxRedirect").attr("data-ajax", '/@' + user_name );
							$("#ajaxRedirect").click();
						}, 500);

					}
				}
			});

		});
        $( document ).on( 'change', '#avatar_profileimg', function(e){
			var countFiles = $(this)[0].files.length;
			var imgPath = $(this)[0].value;
			var extn = imgPath.substring(imgPath.lastIndexOf('.') + 1).toLowerCase();
			var image_holder = $("#profile_image_holder");
			var attach = new Array();
			image_holder.empty();
			if(countFiles > 8) {
				M.toast({html: 'Please select Four Images only.'});
			} else if (extn == "gif" || extn == "png" || extn == "jpg" || extn == "jpeg") {
				if (typeof(FileReader) != "undefined") {
					var formData = new FormData();
					//loop for each file selected for uploaded.
					for (var i = 0; i < countFiles; i++) {
						attach[i] = i;
						var reader = new FileReader();
						reader.onload = function(e) {

						};
						reader.readAsDataURL($(this)[0].files[i]);
						formData.append("avaters"+i, $(this)[0].files[i],$(this)[0].files[i].value );
					}
					$('.profile_count_imgs').text(countFiles);
					var bar = $('#c_det');
					var status = $('#c_perc');
					$('#upload_images').modal('open');
					$.ajax({
						xhr: function() {
							var xhr = new window.XMLHttpRequest();
							xhr.upload.addEventListener("progress", function(evt){
								if (evt.lengthComputable) {
								  	var percentComplete = evt.loaded / evt.total;
								  		percentComplete = parseInt(percentComplete * 100);
								  		status.html( percentComplete + "%");
								  		bar.width(percentComplete + '%');
								  		if (percentComplete === 100) {
											bar.hide();
                                            bar.width('0%');
                                            status.html( "0%");
                                            $('#modal_profileimgs .progress').addClass('hide');
                                            $('#modal_profileimgs #status').addClass('hide');
											status.hide();
											$( '.select_profile_image' ).show();
                                            $('#upload_images').modal('close');
										}
								}
							}, false);
							return xhr;
						},
						url: window.ajax + 'profile/upload_avater',
						type: "POST",
						async: true,
						data: formData,
						cache: false,
						contentType: false,
						processData: false,
						timeout: 60000,
						dataType: false,
						success: function(result) {
							if( result.status == 200 ){
                                $('#modal_profileimgs').modal('close');
                                $("#ajaxRedirect").attr("data-ajax", '/' + window.loggedin_user);
                                $("#ajaxRedirect").click();
                                e.preventDefault();
							}
						}
					});
				} else {
					M.toast({html: 'Please select only Images.'});
				}
			} else {
				M.toast({html: "This browser does not support FileReader."});
			}
		});
        $( document ).on( 'click', '#send_otp', function(e){
			e.preventDefault();
            let txt = $(this).text();
            $(this).text("Please wait..").attr('disabled', true);
            $.ajax({
                type: 'GET',
                url: window.ajax + 'useractions/send_verefication_sms',
                data: {phone: $('#mobile_validate').val()},
                success: function(data){
                    if( data.status == 200 ){
                        $('#send_otp').text(txt).attr('disabled', true);
                        $('.enter_otp').fadeIn(100);
                        $('.enter_otp').find('#otp_check_phone').focus();
                    }else{
                        $('#send_otp').text(txt).attr('disabled', false);
                        $('#mobile_validate').focus();
                        M.toast({html: "Cannot send verification sms right now, try again later."});
                    }
                },
                error: function (data) {
                    $('#send_otp').text(txt).attr('disabled', false);
                    $('#mobile_validate').focus();
                    M.toast({html: data.responseJSON.message});
                },
            });
		});
		$( document ).on( 'keypress', '#otp_check', function(e){
			if($(this).val().length == 3) {
				$('form.slider-three').find('button.reset').attr('disabled', false);
			} else {}
		});
		$( document ).on( 'click', '#send_otp_email', function(e){
			e.preventDefault();
            let default_email = $('#email').attr('data-email');
			let email = $('#email').val();
			let txt = $(this).text();
            $(this).text("Please wait..").attr('disabled', true);
            let formData = new FormData();
                formData.append("email", email );
                $.ajax({
                    type: 'POST',
                    url: window.ajax + '/useractions/send_verefication_email',
                    data: {"email":email},
                    processData: true,
                    success: function(data) {
                        if( data.status == 200 ){
                            $('#send_otp_email').text(txt).attr('disabled', true);
                            $('.enter_otp_email').fadeIn(100);
                            $('.enter_otp_email').find('#otp_check_email').focus();
                        }
                    },
                    error: function (data) {
                        M.toast({html:data.responseJSON.message});
                        setTimeout(function(){
                            $('#send_otp_email').text(txt).attr('disabled', null);
                            $('#email').attr('value',default_email);
                            $('#email').val(default_email);
						},1000);
                    }
                });

		});
        $( document ).on( 'click', '#send_report_btn', function(e){
            e.preventDefault();
            let report_content = $.trim($("#report_content").val());
            let userid = $('#send_report_btn').attr('data-userid');
            $.ajax({
                type: 'POST',
                url: window.ajax + '/useractions/report',
                data: {'report_content': report_content,'userid' : userid},
                processData: true,
                success: function(data) {
                    if( data.status == 200 ){
                        $('#modal_report').modal("close");
                        $('#report_content').val('');
                        $( '.report_text' ).attr( 'data-ajax-post', '/useractions/unreport' );
                        $( '.report_text' ).attr( 'data-ajax-callback', 'callback_unreport' );
                        $( '.report_text' ).attr( 'data-ajax-params', 'userid='+userid );
                        $( '.report_text' ).html( data.report_text );
                        $( '.report_text' ).removeClass('modal-trigger');
                        $( '.report_text' ).attr('href','javascript:void(0);');
                    }
                },
                error: function (data) {
                    M.toast({html:data.responseJSON.message});
                    setTimeout(function(){
                        $('#modal_report').modal("close");
                        $('#report_content').val('');
                    },1000);
                }
            });
        });
		$( document ).on( 'keypress', '#otp_check_email', function(e){
			if($(this).val().length == 3) {
                verify_email_code(this);
			} else {}
		});
        $( document ).on( 'paste', '#otp_check_email', function(e){
            var pastedData = e.originalEvent.clipboardData.getData('text');
            if(pastedData.length === 4) {
                var vl = $(this);
                vl.val(pastedData);
                verify_email_code(this);
            } else {}
            e.preventDefault();
        });
		$( document ).on( 'keypress', '#otp_check_phone', function(e){
			if($(this).val().length == 3) {
                verify_sms_code(this);
			} else {}
		});
        $( document ).on( 'paste', '#otp_check_phone', function(e){
            var pastedData = e.originalEvent.clipboardData.getData('text');
            if(pastedData.length === 4) {
                var vl = $(this);
                vl.val(pastedData);
                $.get( window.ajax + 'useractions/get_sms_verification_code', function(data, status){
                    if( data.status == 200 ){
                        if( vl.val() == data.code ){
                            var data = {
                                'verified': 1,
                                'phone_verified': 1,
                                'start_up': 3,
                                'phone_number': $('#mobile_validate').val()
                            };
                            $.get( window.ajax + 'profile/set_data', data );
                            setTimeout(function(){
                                window.location = window.site_url;
                            }, 1000);
                        }else{
                            M.toast({html: "Wronge verification sms code, try again later."});
                            vl.val('');
                            vl.focus();
                        }
                    }else{
                        M.toast({html: "Wronge verification sms code, try again later."});
                    }
                });
            } else {}
            e.preventDefault();
        });
        $( document ).on( 'paste', '#otp_check_forget_email', function(e){
            var pastedData = e.originalEvent.clipboardData.getData('text');
            if(pastedData.length === 4) {
                var vl = $(this);
                    vl.val(pastedData);
                verify_email_code(this);

            } else {}
            e.preventDefault();
        });
		$( document ).on( 'keypress', '#otp_check_forget_email', function(e){
			if (e.keyCode == 13) {
				e.preventDefault();

				if($(this).val().length === 4) {
                    verify_email_code(this);
				} else {}
			}
		});
        $( document ).on( 'paste', '#otp_check_forget_phone', function(e){
            var pastedData = e.originalEvent.clipboardData.getData('text');
            if(pastedData.length === 4) {
                var vl = $(this);
                vl.val(pastedData);
                verify_sms_code(this);
            } else {}
            e.preventDefault();
        });
        $( document ).on( 'keypress', '#otp_check_forget_phone', function(e){
            if (e.keyCode == 13) {
                e.preventDefault();
                if($(this).val().length === 4) {
                    verify_sms_code(this);
                } else {}
            }
        });
		// Home Filters
		$( document ).on( 'click', '#home_filters_toggle, .dt_home_filters_head p span', function(e){
			e.preventDefault();
			$('.dt_home_filters_prnt').addClass('open');
			$('#home_filters').collapsible('open');
			$('.filter_tabs').tabs();
		});
		$( document ).on( 'click', '#home_filters_close', function(e){
			e.preventDefault();
			$('#home_filters').collapsible('close');
			setTimeout(function(){
				$('.dt_home_filters_prnt').removeClass('open')
			}, 200);
		});
		$( document ).on( 'click', '.dt_plans label', function(){
			$('.pay_using').removeClass('hidden');
		});

  	});
})(jQuery);

(function($){
    $(function(){
        $( document ).on( 'click', '#mylikes', function(e) {
            $('#likes_modal').removeClass('hide');
            $('#likes_modal').addClass('modal');
            $('#likes_modal').modal({
                onOpenEnd: function () {
                    $.ajax({
                        cache: false,
                        type: "GET",
                        timeout: 5000,
                        url:  window.ajax + '/profile/get_profile_likes',
                        success: function(result) {
                            if(result.status == 200 ){
                                $('.dt_modal_user_list_profile').html(result.likes);
                            }
                        },
                        error: function(result) {

                        }
                    });
                }
            }).modal("open");
        });
        $( document ).on( 'click', '#myViews', function(e) {
            $('#views_modal').removeClass('hide');
            $('#views_modal').addClass('modal');
            $('#views_modal').modal({
                onOpenEnd: function () {
                    $.ajax({
                        cache: false,
                        type: "GET",
                        timeout: 5000,
                        url:  window.ajax + '/profile/get_profile_views',
                        success: function(result) {
                            if(result.status == 200 ){
                                $('.dt_modal_user_vlist_profile').html(result.views);
                            }
                        },
                        error: function(result) {

                        }
                    });
                }
            }).modal("open");
        });
    });
})(jQuery);

// find match
(function($){
    $(function(){
        $( document ).on( 'click', '#btn_buymore_xvisits', function(e){
            e.preventDefault();
            let formData = new FormData();
                formData.append( 'uid', $(this).attr('data-userid') );

            let url = window.ajax + '/profile/buymore_xvisits';
            $.ajax({
                url: url,
                type: "POST",
                async: false,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000,
                dataType: false,
                success: function(result) {
                    if(result.status == 200){
                        $('#buy_xvisits').modal('close');
                        $('#credit_amount').html(result.current_credit);
                        $("#ajaxRedirect").attr("data-ajax", '');
                        $("#ajaxRedirect").attr("data-ajax", '/popularity');
                        $("#ajaxRedirect").click();
                    }
                }
            });
        });

        $( document ).on( 'click', '#btn_buymore_xmatches', function(e){
            e.preventDefault();
            let formData = new FormData();
            formData.append( 'uid', $(this).attr('data-userid') );
            let url = window.ajax + '/profile/buymore_xmatches';
            $.ajax({
                url: url,
                type: "POST",
                async: false,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000,
                dataType: false,
                success: function(result) {
                    if(result.status == 200){
                        $('#buy_xmatches').modal('close');
                        $('#credit_amount').html(result.current_credit);
                        $("#ajaxRedirect").attr("data-ajax", '');
                        $("#ajaxRedirect").attr("data-ajax", '/popularity');
                        $("#ajaxRedirect").click();
                    }
                }
            });
        });

        $( document ).on( 'click', '#btn_buymore_xlikes', function(e){
            e.preventDefault();
            let formData = new FormData();
            formData.append( 'uid', $(this).attr('data-userid') );
            let url = window.ajax + '/profile/buymore_xlikes';
            $.ajax({
                url: url,
                type: "POST",
                async: false,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000,
                dataType: false,
                success: function(result) {
                    if(result.status == 200){
                        $('#buy_xlikes').modal('close');
                        $('#credit_amount').html(result.current_credit);
                        $("#ajaxRedirect").attr("data-ajax", '');
                        $("#ajaxRedirect").attr("data-ajax", '/popularity');
                        $("#ajaxRedirect").click();
                    }
                }
            });
        });
        $( document ).on( 'click', '#btn_buymore_chat_credit', function(e){
            e.preventDefault();
            let formData = new FormData();
                formData.append( 'uid', $(this).attr('data-userid') );
                formData.append( 'chat_uid', $(this).attr('data-chat-userid') );
            let url = window.ajax + '/chat/buymore_chat_credit';
            $.ajax({
                url: url,
                type: "POST",
                async: false,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000,
                dataType: false,
                success: function(result) {
                    if(result.status == 200){
                        $('#buy_chat_credits').modal('close');
                        $('#credit_amount').html(result.current_credit);
                        $('[data-ajax-callback="open_private_conversation"]').trigger('click');
                    }
                }
            });
        });
        $( document ).on( 'click', '#btn_buystikcers', function(e){
            e.preventDefault();
            let formData = new FormData();
            formData.append( 'uid', $(this).attr('data-userid') );
            let url = window.ajax + '/chat/buystickers';
            $.ajax({
                url: url,
                type: "POST",
                async: false,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000,
                dataType: false,
                success: function(result) {
                    if(result.status == 200){
                        $('#credit_amount').html(result.current_credit);
                        $('#stikerlist').empty();
                        $('#chat_message_upload_stiker').trigger('click');
                    }
                }
            });
        });
        $( document ).on( 'click', '#boost_btn', function(e){
            e.preventDefault();
            $('#modal_boost').modal('open');
        });
        $( document ).on( 'click', '#btn_boostme', function(e){
            e.preventDefault();
            let formData = new FormData();
            	formData.append( 'uid', $(this).attr('data-userid') );
            let url = window.ajax + '/useractions/boostnow';
            $.ajax({
                url: url,
                type: "POST",
                async: false,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000,
                dataType: false,
                success: function(result) {
                	if(result.status == 200){
						location.reload();
                        $('#credit_amount').html(result.current_credit);
                        $('#modal_boost').modal('close');
                        $("#ajaxRedirect").attr("data-ajax", '');
                        $("#ajaxRedirect").attr("data-ajax", '/find-matches');
                        $("#ajaxRedirect").click();
					}
                }
            });
        });
        $( document ).on( 'click', '#btn_search_basic', function(e){
        	e.preventDefault();
        	let gender = [];
            $("._gender:checked").each ( function() {
                gender.push($(this).val());
            });
            let formData = new FormData();
				if(gender.length > 0) {
					formData.append('_gender', gender);
				}
				formData.append( '_age_from', $('._age_from').find(":selected").val() );
				formData.append( '_age_to', $('._age_to').find(":selected").val() );
				formData.append( '_located', $('#_located').val() );
				if( $('#_location').val() !== '. . .') {
                    formData.append('_location', decodeURIComponent($('#_location').val()));
                }else{
                    formData.append('_location', '');
				}
				formData.append( '_lat', $('#_lat').val() );
				formData.append( '_lng', $('#_lng').val() );
            	formData.append( 'page', '0' );
            let url = window.ajax + '/loadmore/find_matches';
            $.ajax({
                url: url,
                type: "POST",
                async: false,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000,
                dataType: false,
                success: function(result) {
                    $('#search_users_container').empty();
                    callback_load_more_search_users( result );
                }
            });
        });
        $( document ).on( 'click', '#btn_search_looks', function(e){
            e.preventDefault();
            let body = [];
            $("._body:checked").each ( function() {
                body.push($(this).val());
            });
            let formData = new FormData();
            if(body.length > 0) {
                formData.append('_body', body);
            }
            formData.append( '_height_from', $('.height_from').find(":selected").val() );
            formData.append( '_height_to', $('.height_to').find(":selected").val() );
            formData.append( 'page', '0' );
            let url = window.ajax + '/loadmore/find_matches';
            $.ajax({
                url: url,
                type: "POST",
                async: false,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000,
                dataType: false,
                success: function(result) {
                    $('#search_users_container').empty();
                    callback_load_more_search_users( result );
                }
            });
        });
        $( document ).on( 'click', '#btn_search_background', function(e){
            e.preventDefault();
            let ethnicity = [];
            $("._ethnicity:checked").each ( function() {
                ethnicity.push($(this).val());
            });
            let religion = [];
            $("._religion:checked").each ( function() {
                religion.push($(this).val());
            });
            let formData = new FormData();
            if(ethnicity.length > 0) {
                formData.append('_ethnicity', ethnicity);
            }
            if(religion.length > 0) {
                formData.append('_religion', religion);
            }
            formData.append( '_language', $('._language').find(":selected").val() );
            formData.append( 'page', '0' );

            let url = window.ajax + '/loadmore/find_matches';
            $.ajax({
                url: url,
                type: "POST",
                async: false,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000,
                dataType: false,
                success: function(result) {
                    $('#search_users_container').empty();
                    callback_load_more_search_users( result );
                }
            });
        });
        $( document ).on( 'click', '#btn_search_lifestyle', function(e){
            e.preventDefault();
            let relationship = [];
            $("._relationship:checked").each ( function() {
                relationship.push($(this).val());
            });

            let smoke = [];
            $("._smoke:checked").each ( function() {
                smoke.push($(this).val());
            });

            let drink = [];
            $("._drink:checked").each ( function() {
                drink.push($(this).val());
            });

            let formData = new FormData();
            if(relationship.length > 0){
                formData.append( '_relationship', relationship );
            }
            if(smoke.length > 0){
                formData.append( '_smoke', smoke );
			}
            if(drink.length > 0){
                formData.append( '_drink', drink );
			}
            formData.append( 'page', '0' );

            let url = window.ajax + '/loadmore/find_matches';
            $.ajax({
                url: url,
                type: "POST",
                async: false,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000,
                dataType: false,
                success: function(result) {
                    $('#search_users_container').empty();
                    callback_load_more_search_users( result );
                }
            });
        });
        $( document ).on( 'click', '#btn_search_more', function(e){
            e.preventDefault();
            let education = [];
            $("._education:checked").each ( function() {
                education.push($(this).val());
            });

            let pets = [];
            $("._pets:checked").each ( function() {
                pets.push($(this).val());
            });

            let formData = new FormData();
            if(education.length > 0){
                formData.append( '_education', education );
            }
            if(pets.length > 0){
                formData.append( '_pets', pets );
            }
            formData.append( '_interest', $('#interest').val() );
            formData.append( 'page', '0' );

            let url = window.ajax + '/loadmore/find_matches';
            $.ajax({
                url: url,
                type: "POST",
                async: false,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000,
                dataType: false,
                success: function(result) {
                    $('#search_users_container').empty();
                    callback_load_more_search_users( result );
                }
            });
        });
        $( document ).on( 'click', '._gender', function(e) {
            let data_txt = $(this).attr('data-txt');
            let data_val = $(this).val();
            let gList = [];
            $('._gender').each(function () {
                if (this.checked) {
                    gList.push($(this).attr('data-txt'));
                }
            });
            let a = gList.indexOf($('._gender[data-vx="_all_"]').attr('data-txt'));
            if (a > 0) {
                gList.splice(a, 1);
        	}
			if( $(this).attr('data-vx') == '_all_' ){
				$('._gender').attr('checked',null);
				$(this).prop('checked','checked');
                $('._gender[data-vx="_all_"]').css({'color':'#c649b8','font-weight':'500'});
                gList = [];
                gList.push(data_txt);
			}else{
				$('._gender[data-vx="_all_"]').attr('checked',null);
                $('._gender[data-vx="_all_"]').css({'color':'inherit','font-weight':'normal'});
			}

			$('#gender').html( gList.join(',') );

            if( gList.length === 0 ){
                $('#gender').html( $('._gender[data-vx="_all_"]').attr('data-txt') );
            }
            if( gList.length === 1 ){
                $('#gender').html( gList.join(',') );
            }
        });
        $( document ).on( 'change', '._age_from', function(e){
            var optionSelected = $("option:selected", this);
            var valueSelected = this.value;
            $('#age_from').html(valueSelected);
        });
        $( document ).on( 'change', '._age_to', function(e){
            var optionSelected = $("option:selected", this);
            var valueSelected = this.value;
            $('#age_to').html(valueSelected);
        });
        $( document ).on( 'change', '#_located', function(e){
            var valueSelected = this.value;
            $('#located').html(valueSelected);
        });
        $( document ).on( 'keyup', '#_location', function(e){
            var valueSelected = this.value;
            $('#location').html(valueSelected);
        });
        $( document ).on( 'click', 'img.gift', function(e) {
            e.preventDefault();
            let id = $(this).attr('data-id');
            $('img.gift').css({'border':'none'});
            $(this).css({'border':'2px solid #d35147'});
            if( id > 0 ){
                $('#btn-send-gift').attr('disabled',null);
                $('#btn-send-gift').attr('data-selected',id);
            }
        });
        $( document ).on( 'click', '#btn-send-gift', function(e) {
            e.preventDefault();
            let id = $(this).attr('data-selected');
            let to = $(this).attr('data-to');
            if( id > 0  && to > 0){
                var url = window.ajax + '/profile/send_gift';
                var formData = new FormData();
                    formData.append("gift_id", id );
                    formData.append("to", to );
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: formData,
                    contentType:false,
                    cache: false,
                    processData:false,
                    success: function(data){
                        if(data.status == 200) {
                            $('#credit_amount').html(data.current_credit);
                            $('#modal_gifts').modal({}).modal("close");
                            if( data.current_credit >= data.cost_per_gift ){
                                $('#gifts_container').show();
                                $('#send_gift_footer').show();
								$('#buy_credits_gift').addClass('hide');
							}else{
                                $('#gifts_container').remove();
                                $('#send_gift_footer').remove();
                                $('#buy_credits_gift').removeClass('hide');
							}
                        }
                    },
                    error: function (data) {},
                });
                e.preventDefault();
            }else{
                $('#btn-send-gift').attr('disabled',true);
                $('#btn-send-gift').attr('data-selected','');
            }
        });
        $( document ).on( 'click', 'button.like', function(e) {
			e.preventDefault();
			let users = $( '.usr_thumb' ).length;
			let obj = $(this).closest('.mtc_usrd_content');
			let thumb = $( '.usr_thumb.isActive' );
			if( users > 0 ) {
                thumb.next().addClass('isActive');
                obj.next().show();
                thumb.remove();
                obj.remove();
            }
            if( users == 7 ) {
                console.log('xget new users');
                $('#btn_load_more_match_users').trigger('click');
            }else if( users == 1 ) {
                $('.mtc_usr_details').html('<h5 class="empty_state"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9,4A4,4 0 0,1 13,8A4,4 0 0,1 9,12A4,4 0 0,1 5,8A4,4 0 0,1 9,4M9,6A2,2 0 0,0 7,8A2,2 0 0,0 9,10A2,2 0 0,0 11,8A2,2 0 0,0 9,6M9,13C11.67,13 17,14.34 17,17V20H1V17C1,14.34 6.33,13 9,13M9,14.9C6.03,14.9 2.9,16.36 2.9,17V18.1H15.1V17C15.1,16.36 11.97,14.9 9,14.9M15,4A4,4 0 0,1 19,8A4,4 0 0,1 15,12C14.53,12 14.08,11.92 13.67,11.77C14.5,10.74 15,9.43 15,8C15,6.57 14.5,5.26 13.67,4.23C14.08,4.08 14.53,4 15,4M23,17V20H19V16.5C19,15.25 18.24,14.1 16.97,13.18C19.68,13.62 23,14.9 23,17Z"></path></svg>'+$('#btn_load_more_match_users').attr( 'data-lang-nomore')+'</h5>');
            }
            $('.random_user_item[data-uid="'+$(this).attr('data-userid')+'"]').remove();

            $('.usr_thumb').hide();
            $('.usr_thumb:lt(8)').show();

        });
        $( document ).on( 'click', 'button.dislike', function(e) {
            e.preventDefault();
            let users = $( '.usr_thumb' ).length;
            let obj = $(this).closest('.mtc_usrd_content');
            let thumb = $( '.usr_thumb.isActive' );
            if( users > 0 ) {
                thumb.next().addClass('isActive');
                obj.next().show();
                thumb.remove();
                obj.remove();
            }
            if( users == 4 ) {
                console.log('yget new users');
                $('#btn_load_more_match_users').trigger('click');
            }else if( users == 1 ) {
                $('.mtc_usr_details').html('<h5 class="empty_state"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9,4A4,4 0 0,1 13,8A4,4 0 0,1 9,12A4,4 0 0,1 5,8A4,4 0 0,1 9,4M9,6A2,2 0 0,0 7,8A2,2 0 0,0 9,10A2,2 0 0,0 11,8A2,2 0 0,0 9,6M9,13C11.67,13 17,14.34 17,17V20H1V17C1,14.34 6.33,13 9,13M9,14.9C6.03,14.9 2.9,16.36 2.9,17V18.1H15.1V17C15.1,16.36 11.97,14.9 9,14.9M15,4A4,4 0 0,1 19,8A4,4 0 0,1 15,12C14.53,12 14.08,11.92 13.67,11.77C14.5,10.74 15,9.43 15,8C15,6.57 14.5,5.26 13.67,4.23C14.08,4.08 14.53,4 15,4M23,17V20H19V16.5C19,15.25 18.24,14.1 16.97,13.18C19.68,13.62 23,14.9 23,17Z"></path></svg>'+$('#btn_load_more_match_users').attr( 'data-lang-nomore')+'</h5>');
            }
            $('.random_user_item[data-uid="'+$(this).attr('data-userid')+'"]').remove();
            $('.usr_thumb').hide();
            $('.usr_thumb:lt(8)').show();
        });

    });
})(jQuery);

function event_runner(ajax){
    if($('#_location').length) {
        initAutocomplete();
    }
    if($('#ulocation').length) {
        initAutocomplete();
    }
    var h, i;
    var dataValues = [];
    var svgs = document.querySelectorAll('.user_popularity_icn');
    for (i = 0; i < svgs.length; i++) {
        dataValues.push(svgs[i].dataset["value"]);
    }
    function drawcircles(duration = '1.3s') {
        var circlelines = document.querySelectorAll('.load-circle');
        for (h = 0; h < circlelines.length; h++) {
            var totalLength = circlelines[h].getTotalLength();
            var offset = totalLength - ((dataValues[h] / 100) * totalLength);
            circlelines[h].style.transitionDuration = duration;
            circlelines[h].style.strokeDashoffset = offset + "px";
        }
    }
    drawcircles();
    if($('#chat_time').length){
        $('#chat_time').each(function(i){
            var tm = $(this).attr('data-chat-time');
            var upgradeTime = tm;
            var seconds = upgradeTime;
            var $div = $(this);
            var countdownTimer = setInterval(function(){
                var days        = Math.floor(seconds/24/60/60);
                var hoursLeft   = Math.floor((seconds) - (days*86400));
                var hours       = Math.floor(hoursLeft/3600);
                var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
                var minutes     = Math.floor(minutesLeft/60);
                var remainingSeconds = seconds % 60;
                function pad(n) {
                    return (n < 10 ? "0" + n : n);
                }
                $div.html( pad(hours) + ":" + pad(minutes) + ":" + pad(remainingSeconds) );
                if (seconds == 0) {
                    clearInterval(countdownTimer);
                    $div.html("Completed");
                } else {
                    seconds--;
                }
            }, 1000);
        });
    }
	if ($('.boosted_time').length) {
		$('.boosted_time').each(function (i) {
			var _Minutes = 60 * $(this).attr('data-boosted-time');
				_startTimer(_Minutes, $(this));
		});
	}
	if(ajax === false) {
		if ($('.global_boosted_time').length) {
			$('.global_boosted_time').each(function (i) {
				var _Minutes = 60 * $(this).attr('data-boosted-time');
				_startTimer(_Minutes, $(this));
			});
		}
	}
    if($('.received_gift_modal').length){
        $('.received_gift_modal').each(function(i){
            let gift_id = $(this).attr('data-gift-id');
            let gift_div = $(this);
            $(this).removeClass('hide').addClass('modal').addClass('modal_sm').addClass('modal-fixed-footer');
            $(this).modal({
                onOpenEnd: function () {

                },
                onCloseEnd: function () {
                    var url = window.ajax + '/profile/record_gift_seen';
                    var formData = new FormData();
                    formData.append("id", gift_id );
                    $.ajax({
                        type: 'POST',
                        url: url,
                        data: formData,
                        contentType:false,
                        cache: false,
                        processData:false,
                        success: function(data){
                            if(data.status == 200) {
                                gift_div.remove();
                            }
                        },
                        error: function (data) {},
                    });
                }
            }).modal("open");
        });
    }
    if ($('.match_usr_img_slidr').length > 0) {
        if ($('.match_usr_img_slidr').html().trim() !== '') {
            try {
                $('.match_usr_img_slidr').carousel({
                    fullWidth: true,
                    indicators: true
                });
            } catch(e) {}
        }
    }

}
$(window).load(function() {
    event_runner(false);
});
function clickAndDisable(link) {
	link.className += " disabled";
	link.onclick = function(event) {
	   event.preventDefault();
	}
}
function createCookie(name,value) {
	var date = new Date();
	date.setTime(date.getTime()+(10 * 365 * 24 * 60 * 60 * 1000 ) );
	var expires = "; expires="+date.toGMTString();
    document.cookie = name+"="+value+expires+"; path=/";
}
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
function init_load_more(data,button,container,template){
    let params = button.attr('data-ajax-params');
    let search = "page=";
    search += data.page - 1;
    let replacement = "page=" + data.page;
    button.attr('data-ajax-params', params.replace(new RegExp(search, 'g'), replacement));
	if( template.length == 0 && data.html !== ''){
        container.append(data.html);
        return true;
	}else if( template.length == 0 && data.html == '') {
        button.html(button.attr('data-lang-nomore'));
        button.removeAttr('data-ajax-params');
        button.removeAttr('data-ajax-post');
        button.removeAttr('data-ajax-callback');
	}else {
        let templateHtml = template.html().trim();
        let dtemplateHtml = '';
        let listHtml = '';
        if (data.html.length == 0) {
            button.html(button.attr('data-lang-nomore'));
            button.removeAttr('data-ajax-params');
            button.removeAttr('data-ajax-post');
            button.removeAttr('data-ajax-callback');
        } else {
            for (let key in data.list) {
                if (data.list.hasOwnProperty(key)) {
                    for (let subkey in data.list[key]) {
                        if (data.list[key].hasOwnProperty(subkey)) {
                            dtemplateHtml = templateHtml.interpolate(data.list[key]);
                        }
                    }
                    listHtml += dtemplateHtml;
                }
            }
            container.append(listHtml);
        }
    }
}
String.prototype.interpolate = function(params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${this}\`;`)(...vals);
}
$(window).load(function(){
  var h, i;
  var dataValues = [];
  var svgs = document.querySelectorAll('.user_popularity_icn');
  for (i = 0; i < svgs.length; i++) {
  dataValues.push(svgs[i].dataset["value"]);
  } 
  function drawcircles(duration = '1.3s') {
    var circlelines = document.querySelectorAll('.load-circle');
    for (h = 0; h < circlelines.length; h++) {
      var totalLength = circlelines[h].getTotalLength();
      var offset = totalLength - ((dataValues[h] / 100) * totalLength);
      circlelines[h].style.transitionDuration = duration;
      circlelines[h].style.strokeDashoffset = offset + "px";
    }
  }
  drawcircles();
});

$(document).ready(function() {
	if ($('.match_usr_img_slidr').length > 0) {
        if ($('.match_usr_img_slidr').html().trim() !== '') {
            try {
				$('.match_usr_img_slidr').carousel({
					fullWidth: true,
					indicators: true
				});
            } catch(e) {}
        }
    }
});
function Previous_Picture() {
    try {
        $('.match_usr_img_slidr').carousel('prev');
    } catch(e) {}
};
function Next_Picture() {
    try {
        $('.match_usr_img_slidr').carousel('next');
    } catch(e) {}
};
$('#open_slide').on('click', function(event) {
	event.preventDefault();
	$('body').addClass('side_open');
});