function hslColor(e, t, n) {
    return"hsl(" + e + "," + t + "%," + n + "%)"
}
function createColorPickerCanvas() {
    for (var e = document.getElementById("canvasColorPicker"), t = e.getContext("2d"), n = t.createLinearGradient(0, 0, e.width, 0), o = e.height, r = e.width, i = 0; o > i; ++i) {
        var a = i / o, c = Math.floor(360 * a), s = 100, l = 50;
        t.beginPath(), t.strokeStyle = hslColor(c, s, l), t.moveTo(0, i), t.lineTo(r, i), t.stroke()
    }
    n.addColorStop(0, "rgba(0,0,0,1)"), n.addColorStop(1, "rgba(1,1,1,0)"), t.fillStyle = n, t.fillRect(0, 0, e.width, e.height)
}
function localStorageAdapter(e, t, n) {
    var o = {roomSettings: {sidebarCollapsed: !1}, client: {cameraAccessGranted: !1}, descriptions: {shownRoomDescription: !1}};
    if (void 0 === e) {
        var r = {}, i = window.localStorage;
        for (t in i)r[t] = JSON.parse(i[t]);
        return r
    }
    var a;
    if (window.localStorage[e] ? a = JSON.parse(window.localStorage.getItem(e)) : (a = o[e], window.localStorage.setItem(e, JSON.stringify(a))), void 0 !== n)a[t] = n, window.localStorage.setItem(e, JSON.stringify(a)); else if (void 0 !== t)return a[t];
    return a
}
angular.module("videoconference", ["ngRoute", "ngSanitize", "flags", "flagsGoogleAnalytics", "ui.bootstrap"]).factory("serverSocket", ["$location", "$rootScope", function (e, t) {
    var n = io.connect(e.protocol() + "://" + e.host() + ":" + e.port());
    return t.serverDisconnected = !1, n.on("disconnect", function () {
        t.$apply(function () {
            t.serverDisconnected = !0
        })
    }), n.on("reconnect", function () {
        location.reload()
    }), n
}]).directive("vcMuted",function () {
    return function (e, t, n) {
        e.$watch(n.vcMuted, function () {
            t[0].muted = e.$eval(n.vcMuted) === !0 ? "muted" : void 0
        })
    }
}).directive("clickConfirm",function () {
    return function (e, t) {
        t.bind("click", function (e) {
            confirm("Are you sure you want to leave the room?") || (e.preventDefault(), e.stopPropagation())
        })
    }
}).directive("vcCreateColorPicker",function () {
    return function () {
        createColorPickerCanvas()
    }
}).directive("vcSubmit",function () {
    return function (e, t, n) {
        t.bind("submit", function (t) {
            t.preventDefault(), e.$apply(n.vcSubmit)
        })
    }
}).directive("ngKeystroke",function () {
    return function (e, t) {
        t.on("keyup", function (e) {
            if (32 === e.keyCode || 189 === e.keyCode) {
                var t = e.target, n = t.selectionStart;
                t.value = t.value.replace(/ /g, "-"), t.value = t.value.replace(/_/g, "-"), t.setSelectionRange(n, n)
            }
        })
    }
}).config(["$provide", "$routeProvider", "$locationProvider", "flagsResolver", function (e, t, n, o) {
    e.value("prefix", "appearin"), e.value("flags.config.googleAnalytics", {experimentId: window.googleAnalyticsExperimentId, experiments: {F28vmLhIS8S_4Y7klxhoew: [
        {group: "Original", flags: []},
        {group: "frontpage-large", flags: ["frontpage-large"]}
    ]}}), e.value("flags.config", {defaultFlags: {group: "frontpage-large", flags: ["frontpage-large"]}}), t.when("/", {templateUrl: "/templates/frontpage.html", controller: "frontpageController", resolve: {flags: o()}}).when("/error/:errorName", {templateUrl: "/templates/error.html", controller: "errorController", resolve: {flags: o()}}).when("/information/:informationRequested", {templateUrl: "/templates/information.html", controller: "informationController"}).when("/:roomName", {templateUrl: "/templates/views/room.html", controller: "roomController"}).otherwise({templateUrl: "/templates/views/room.html", controller: "roomController", resolve: {flags: o()}}), n.html5Mode(!0)
}]).run(["$rootScope", "$window", function (e, t) {
    e.windowWidth = t.outerWidth, angular.element(t).bind("resize", function () {
        e.windowWidth = t.outerWidth, e.$apply("windowWidth")
    })
}]).run(["$rootScope", "$location", function (e, t) {
    "localhost" === window.location.hostname && (ga("_setDomainName", "none"), window.cxApi && window.cxApi.setDomainName("none")), e.controller = "", e.groupJoined = !1, e.$on("$routeChangeSuccess", function (n, o, r) {
        e.previousController = r ? r.$$route.controller : null, ga("send", "pageview", t.url())
    })
}]), angular.module("videoconference").directive("scrollTo", function () {
    return{restrict: "A", link: function (e, t, n) {
        t.bind("click", function () {
            var e = angular.element(n.scrollTo).offset().top;
            return jQuery("html, body").animate({scrollTop: e}, "slow"), !1
        })
    }}
}), angular.module("videoconference").directive("sidebar", function () {
    return{templateUrl: "/templates/partials/sidebar.html", restrict: "E"}
}), angular.module("videoconference").directive("topbar", function () {
    return{templateUrl: "/templates/partials/topbar.html", restrict: "E", controller: ["$scope", "$rootScope", "$timeout", "Analytics", "RoomService", "Chat", "splitscreenRefresher", function (e, t, n, o, r, i, a) {
        e.descriptionHover = {both: !0, copy: !1, room: !1}, e.hideDescriptions = function () {
            n(function () {
                e.descriptionHover.both = !1
            }, 1e4)
        };
        var c = !1;
        e.openSocialShareMenu = function () {
            c && (o.sendAnalytics("event", "Room", "Used feature", "Opened share social share modal"), c = !0), e.isSocialShareModalOpen = !0
        }, e.copyToClipboard = function () {
            var e = angular.element(".room-url").addClass("flash");
            n(function () {
                e.removeClass("flash")
            }, 100)
        }, e.isRoomLocked = r.roomData.isLocked, e.$watch(function () {
            return r.roomData.isLocked
        }, function () {
            e.isRoomLocked = r.roomData.isLocked
        }), e.toggleLockRoom = function () {
            var t = !e.isRoomLocked;
            r.setLock(t), o.sendAnalytics("event", "Room", "Used feature", "Room " + (t ? "locked" : "unlocked"))
        };
        var s = !1;
        e.chatActive = !1, e.numberOfUnreadMessages = 0, t.$on("new_chat_message", function () {
            e.chatActive || e.numberOfUnreadMessages++
        }), e.toggleChat = function () {
            s || (o.sendAnalytics("event", "Room", "Used feature", "Opened chat"), s = !0), e.numberOfUnreadMessages = 0, e.chatActive = !e.chatActive, n(function () {
                a.refreshLayout(), angular.element("#chat-messages").scrollTop(9999999), e.chatActive && angular.element(".chat input").focus()
            }, 0)
        }, e.owners = r.owners, e.claimRoomButtonText = "Claim room", e.$watch(function () {
            return r.roomData.passwordSet
        }, function (t) {
            t && (e.claimRoomButtonText = "This is my room", e.closeModal("claimRoom"))
        }), e.$watch(function () {
            return r.owners
        }, function (t) {
            e.owners = t, -1 !== t.indexOf(r.selfId) && (e.claimRoomButtonText = "You own this room")
        }), e.openClaimRoomModal = function () {
            e.openModal("claimRoom"), e.maximumTTL = r.maximumTTL
        }, t.$on("owners_changed:error", function (t, n) {
            switch (n.error) {
                case"wrong password":
                    e.claimRoomErrorMessage = "That is not the correct code word for this room.";
                    break;
                case"invalid email":
                    e.claimRoomErrorMessage = "The email you entered is not valid.";
                    break;
                case"password missing":
                    e.claimRoomErrorMessage = "You need to supply a password."
            }
        }), e.addOwner = function () {
            r.addOwner(this.codeword, this.email), o.sendAnalytics("event", "Room", "Used feature", "Claim room password sent"), this.email && o.sendAnalytics("event", "Room", "Used feature", "Claim room with email address"), e.claimRoomErrorMessage = "", this.codeword = "", this.email = ""
        }
    }]}
}), angular.module("videoconference").directive("feedback", function () {
    return{templateUrl: "/templates/partials/feedback.html", restrict: "E", controller: ["$http", "$scope", "RoomService", "Analytics", function (e, t, n, o) {
        t.message = "", t.status = "", t.feedback = "", t.email = "", t.emailOptOut = !1, t.sendFeedback = function () {
            if (o.sendAnalytics("event", "Room", "Used feature", "Sent feedback"), t.message = "", this.feedbackForm.$error.email)return t.message = "The e-mail address you entered is not valid. Did you enter it correctly?", void 0;
            this.email && 0 === this.email.length && (this.email = "Anonymous");
            var n = t.emailOptOut ? "\n\nThe user does not want to be contacted!\n\n" : "", i = this.feedback + "\n\n" + this.email + n + "\n\n\n" + r();
            e.post("/feedback", {text: i, from: this.email, subject: "User Feedback from " + this.email}).success(function () {
                t.message = "Thank you! You are an amazing and beautiful person!", t.status = "success"
            }).error(function () {
                t.message = "We are terribly sorry, but it seems something went wrong when we tried to send your feedback. Mind sending it to feedback@appear.in instead?"
            })
        };
        var r = function () {
            var e = "Room name: " + n.roomName, o = "Detected browser: " + t.webrtcDetectedBrowser, r = "User agent :" + navigator.userAgent, i = "Client count: " + Object.keys(n.clients).length;
            return e + "\n" + o + "\n" + r + "\n" + i
        }
    }]}
}), angular.module("videoconference").directive("vcDropDown", ["$rootScope", function (e) {
    return function (t, n, o) {
        var r, i = $(n), a = $(o.vcDropDown);
        r = "vcDropDownContainer"in o ? o.vcDropDownContainer : void 0;
        var c, s, l = !1, d = !1, u = !1, m = null, f = function () {
            m = $('<div class="modal-backdrop popover-backdrop"></div>').click(p).prependTo($("body"))
        }, p = function (e) {
            if (i.toggleClass("active"), i.toggleClass("bold"), l) {
                var t = i.data("bs.popover").$tip, n = t.find(".popover-content");
                if (d)c = n.width(), s = n.height(), t.hide(); else {
                    var o = $('<div class="popover-filler" />').width(c).height(s);
                    t.append(o), n.detach(), i.data("bs.popover").show(), o.remove(), t.append(n)
                }
            } else a.show(), i.popover("show"), l = !0;
            null === m ? f() : (m.remove(), m = null), d = !d, u = e
        }, g = function () {
            d && p()
        }, h = function () {
            a.hide(), a.find(".dismiss-popover").click(p), "vcDropDownDismiss"in o && $(o.vcDropDownDismiss).mousedown(g), i.popover({html: !0, content: a, placement: o.vcDropDownPlacement, container: r, trigger: "manual", animation: !1}), void 0 === o.vcDropDownDisableClick && i.click(function () {
                p(!1)
            }), void 0 !== o.vcDropDownShow && t.$watch(o.vcDropDownShow, function (e) {
                e === !0 ? d || p(!0) : e === !1 && d && u && p(!0)
            }), e.$on("$routeChangeStart", function () {
                i.popover("destroy"), null !== m && m.remove()
            })
        };
        h()
    }
}]), angular.module("videoconference").directive("videoView", function () {
    return{templateUrl: "/templates/partials/video-view.html", restrict: "E", scope: {client: "=client"}}
}), angular.module("videoconference").directive("dancingDots", function () {
    return function (e, t) {
        (function () {
            var e = 0;
            window.setInterval(function () {
                for (var n = "", o = 0; e > o; o++)n += ".";
                t.text(n), 3 !== e ? e += 1 : e = 0
            }, 500)
        })()
    }
}), angular.module("videoconference").directive("vcCopyToClipboard", ["Analytics", function (e) {
    return{scope: {mouseOver: "&", mouseLeave: "&"}, link: function (t, n) {
        var o = new ZeroClipboard(n, {moviePath: "/libraries/ZeroClipboard.swf"}), r = angular.element(n);
        o.on("complete", function () {
            r.click(), e.sendAnalytics("event", "Room", "Used feature", "Copy to clipboard")
        }), o.on("mouseout", function () {
            t.$apply(function () {
                t.mouseLeave()
            })
        }), o.on("mouseover", function () {
            t.$apply(function () {
                t.mouseOver()
            })
        })
    }}
}]), angular.module("videoconference").directive("modalBox", function () {
    return{templateUrl: "/templates/partials/modal-box.html", restrict: "E", transclude: !0, replace: !0, scope: {isOpen: "=isOpen"}, controller: ["$scope", function (e) {
        e.closeModal = function () {
            e.isOpen = !1, e.$parent.modalActive = !1
        }
    }]}
}), angular.module("videoconference").directive("clickAutoselect", function () {
    return{restrict: "A", link: function (e, t) {
        t.bind("click", function () {
            this.focus(), this.select()
        })
    }}
}), angular.module("videoconference").directive("surpriseVideo", ["$window", function (e) {
    return{restrict: "E", template: '<video autoplay muted class="surprise-video"></video>', link: function (t, n) {
        e.localStorage.client && JSON.parse(e.localStorage.client).cameraAccessGranted && e.getUserMedia({video: !0, audio: !1}, function (t) {
            n.find("video").attr("src", e.URL.createObjectURL(t))
        })
    }}
}]), angular.module("videoconference").directive("chat", function () {
    return{templateUrl: "/templates/partials/chat.html", restrict: "E", replace: !0, controller: ["$scope", "Chat", "$timeout", function (e, t, n) {
        e.messages = t.messages, e.$watch(function () {
            return t.messages
        }, function (t) {
            e.messages = t
        }), e.sendMessage = function () {
            this.message && (t.sendMessage(this.message), this.message = "", n(function () {
                t.updateChatWindow(!0)
            }, 0))
        }
    }]}
}), angular.module("videoconference").directive("dropArea", function () {
    return{restrict: "A", link: function (e, t, n) {
        var o = n.dropArea;
        e[o] && "function" == typeof e[o] && e.enableSetBackgroundImage && (t.bind("dragover", function (e) {
            e.stopPropagation(), e.preventDefault()
        }), t.bind("dragleave", function (t) {
            e[o](), t.stopPropagation(), t.preventDefault()
        }), t.bind("drop", function (t) {
            var n;
            t.stopPropagation(), t.preventDefault(), t.originalEvent.dataTransfer.files.length > 0 && (n = t.originalEvent.dataTransfer.files[0]), e.$apply(function () {
                e[o](n)
            })
        }))
    }}
}), angular.module("videoconference").directive("dragArea", function () {
    return{restrict: "A", link: function (e, t, n) {
        var o = n.dragArea;
        e[o] && "function" == typeof e[o] && e.enableSetBackgroundImage && t.bind("dragenter", function (t) {
            t.stopPropagation(), t.preventDefault(), e.$apply(function () {
                e[o]()
            })
        })
    }}
}), angular.module("videoconference").controller("errorController", ["$scope", "$routeParams", "RoomName", function (e, t, n) {
    e.errorName = t.errorName, e.roomNameRequirements = n.requirements, e.webrtcDetectedBrowser = webrtcDetectedBrowser
}]), angular.module("videoconference").controller("frontpageController", ["$scope", "$location", "$http", "$rootScope", "Analytics", "RoomName", function (e, t, n, o, r, i) {
    o.controller = "frontpage", e.$on("$destroy", function () {
        o.controller = ""
    }), e.roomNameRequirements = i.requirements, e.roomNamePattern = i.pattern, e.roomName = "", e.randomizeName = function () {
        n.post("/random-room-name").success(function (t) {
            e.suggestedRoomName = t.roomName
        })
    }, e.launchRoom = function () {
        r.sendAnalytics("event", "Frontpage", "User action", "Created room from frontpage"), e.roomName = encodeURI(e.roomName.replace(/[_ ]/g, "-")), "" !== e.roomName ? t.url("/" + e.roomName) : t.url("/" + e.suggestedRoomName)
    }, e.getRoomName = function () {
        return"" === e.roomName ? e.suggestedRoomName : e.roomName
    }, e.btnRandomizeName = function () {
        r.sendAnalytics("event", "Frontpage", "User action", "Randomized new room name"), e.randomizeName()
    }, e.randomizeName()
}]), angular.module("videoconference").controller("informationController", [function () {
}]), angular.module("videoconference").controller("roomController", ["$scope", "$routeParams", "serverSocket", "$timeout", "$location", "$rootScope", "RoomService", "Event", "State", "Analytics", "$window", "$log", "splitscreenRefresher", function (e, t, n, o, r, i, a, c, s, l, d, u, m) {
    var f = function () {
        return r.absUrl().replace(r.protocol() + "://", "")
    }, p = 1048576, g = 1572864;
    if (!(getUserMedia && RTCPeerConnection && "prototype"in RTCPeerConnection && "getStreamById"in RTCPeerConnection.prototype))return r.path("/error/webrtc"), void 0;
    e.roomState = "", e.localClient = null;
    var h = "off" === t.video;
    e.localClientId = "", e.clients = a.clients, e.selfStream = a.selfStream, a.roomName = encodeURI(r.path()), e.url = decodeURI(f(r));
    var v = !1, C = !1;
    e.screenShareDenied = !1, e.shareRoomActive = !1, e.isFullScreen = !1, e.toggleScreenShare = !1, e.isNewsletterCheckboxHidden = !0, e.isPopularRoom = a.isPopularRoom, e.backgroundStyle = {}, e.isRoomCreator = "frontpageController" === i.previousController, e.enableClaimRoomFeature = t.claimRoom, e.enableSetBackgroundImage = t.setBackground, e.cursorHidden = !0;
    var E, S = function () {
        e.cursorHidden = !0
    }, N = 0, _ = 0;
    e.showCursor = function (t) {
        var n = Math.abs(t.clientX - N), r = Math.abs(t.clientY - _);
        (n > 1 || r > 1) && (e.cursorHidden = !1, o.cancel(E), E = o(S, 1e3)), N = t.clientX, _ = t.clientY
    };
    var w = {LARGE: "large", SMALL: "small", LOWER_LEFT: "lower_left", LOWER_RIGHT: "lower_right", UPPER_LEFT: "lower_left", UPPER_RIGHT: "upper_right", OFF: "off"};
    e.getNumberOfConnectedClients = function () {
        return e.clients.length
    }, e.localVideoViewState = w.LARGE, e.webrtcDetectedBrowser = webrtcDetectedBrowser, e.clientBrowser = -1 !== d.navigator.userAgent.indexOf("Android") ? "smartphone-android" : "desktop", e.$watch("roomState", function (t) {
        switch (t) {
            case s.WAITING_FOR_ACCESS:
                R();
                break;
            case s.WAITING_FOR_ROOM_INFORMATION:
                a.getRoomInformation();
                break;
            case s.READY:
                h && a.setLocalVideoEnabled(!1), e.isPopularRoom = a.isPopularRoom, I(), o(function () {
                    m.refreshLayout()
                }, 0)
        }
    }), i.$watch("windowWidth", function () {
        e.isFullScreen = screen.height === window.outerHeight
    });
    var I = function () {
        e.localClientId = a.selfId, e.localClient = a.getLocalClient(), e.clients = a.clients
    };
    e.enterRoomWithCodeWord = function () {
        a.roomPassword = this.codeword, e.roomState = s.WAITING_FOR_ROOM_INFORMATION
    }, e.shareRoom = function (t, n) {
        switch (t.preventDefault(), n) {
            case"twitter":
                return d.open("https://twitter.com/intent/tweet?text=Appear%20with%20me%20in&url=" + encodeURIComponent(e.url), "twitter-share-dialog", "width=550, height=420"), l.sendAnalytics("event", "Room", "Used feature", "Shared room link to Twitter"), !1;
            case"facebook":
                return d.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(e.url), "facebook-share-dialog", "width=626, height=436"), l.sendAnalytics("event", "Room", "Used feature", "Shared room link to Facebook"), !1;
            case"googleplus":
                return d.open("https://plus.google.com/share?url=" + encodeURIComponent(e.url), "googleplus-share-dialog", "width=480, height=415"), l.sendAnalytics("event", "Room", "Used feature", "Shared room link to Google+"), !1
        }
    }, e.modalActive = !1, e.closeModal = function (t) {
        var n = e.modals[t];
        return n ? (e.modalActive = !1, n.isOpen = !1, void 0) : (u.warn("Could not find a modal with name " + t), void 0)
    }, e.openModal = function (t) {
        var n = e.modals[t];
        return n ? (e.modalActive = !0, n.hasOpened || (l.sendAnalytics("event", "Room", "Used feature", n.analyticsText), n.hasOpened = !0), n.isOpen = !0, void 0) : (u.warn("Could not find a modal with name " + t), void 0)
    }, e.modals = {feedback: {hasOpened: !1, isOpen: !1, analyticsText: "Opened share feedback modal"}, newsletter: {hasOpened: !1, isOpen: !1, analyticsText: "Opened newsletter modal"}, allowScreenShareInstructions: {hasOpened: !1, isOpen: !1, analyticsText: "allow screen share instructions modal"}, claimRoom: {hasOpened: !1, isOpen: !1, analyticsText: "Opened claim room modal"}, backgroundUpload: {hasOpened: !1, isOpen: !1, analyticsText: "Opened background upload modal"}}, e.openBackgroundUploadModal = function () {
        e.openModal("backgroundUpload")
    }, e.closeBackgroundUploadModal = function () {
        e.closeModal("backgroundUpload"), e.backgroundUploadError = ""
    }, e.handleUploadedBackground = function (t) {
        if (!t)return e.closeBackgroundUploadModal(), void 0;
        if (t.size > g)return e.backgroundUploadError = "Ah, that image was too large. Please keep it under " + g / p + " MB.", void 0;
        if (-1 === t.type.indexOf("image"))return e.backgroundUploadError = "That's not an image, buddy.", void 0;
        var n = new FileReader;
        n.onload = function (n) {
            var o = new Image;
            o.src = "data:" + t.type + ";base64," + btoa(n.target.result), e.$apply(function () {
                e.backgroundStyle.background = "url('" + o.src + "') no-repeat", e.closeBackgroundUploadModal()
            })
        }, n.readAsBinaryString(t)
    }, e.toggleLocalVideoLarge = function () {
        e.localVideoViewState === w.LARGE ? e.localVideoViewState = w.SMALL : e.localVideoViewState === w.SMALL && (e.localVideoViewState = w.LARGE)
    }, e.toggleAudioEnabled = function () {
        e.localClient.isAudioEnabled ? a.setLocalAudioEnabled(!1) : a.setLocalAudioEnabled(!0)
    }, e.toggleVideoEnabled = function () {
        e.localClient.isVideoEnabled ? (a.setLocalVideoEnabled(!1), e.localClient.userHasExplicitlyDisabledVideo = !0) : (a.setLocalVideoEnabled(!0), e.localClient.userHasExplicitlyDisabledVideo = !1)
    }, e.toggleShareScreen = function () {
        if (v || (l.sendAnalytics("event", "Room", "Used feature", "Used screen share"), v = !0), e.localClient.isScreenSharingEnabled)e.localClient.stopScreenShare(); else {
            var t = function () {
                e.$apply(function () {
                    e.screenShareDenied = !0, e.openModal("allowScreenShareInstructions")
                })
            };
            if ("chrome" !== webrtcDetectedBrowser)return;
            window.getUserMedia({video: {mandatory: {chromeMediaSource: "screen"}}}, a.shareScreen, t)
        }
    }, e.$on(c.NEW_CLIENT, function () {
        y()
    }), e.$on(c.CLIENT_LEFT, function () {
        y()
    }), e.$on(c.ROOM_JOINED, function (t, n) {
        if (n && n.error)switch (n.error) {
            case protocol.err.ROOM_LOCKED:
                e.$apply(function () {
                    a.roomData.isLocked = n.isLocked, a.roomData.isPasswordSet = n.isPasswordSet, e.roomData = a.roomData, e.roomState = s.ROOM_LOCKED
                });
                break;
            default:
                d.location = "/error/invalid-room"
        } else y(), e.$apply(function () {
            e.roomState = s.READY
        })
    }), e.toggleFullScreen = function () {
        if (e.isFullScreen)cancelFullScreen(), e.isFullScreen = !1; else {
            var t = document.body;
            getFullScreen(t), e.isFullScreen = !0
        }
        C || (l.sendAnalytics("event", "Room", "Used feature", "Used full screen"), C = !0)
    };
    var R = function () {
        e.roomState = s.PLEASE_GRANT_ACCESS, d.getUserMedia({video: !0, audio: !0}, function (t) {
            d.localStorageAdapter("client", "cameraAccessGranted", !0), "chrome" === webrtcDetectedBrowser || t.getVideoTracks().length > 0 && t.getAudioTracks().length > 0 ? o(function () {
                a.selfStream = t, e.roomState = s.WAITING_FOR_ROOM_INFORMATION
            }) : o(function () {
                e.roomState = s.FIREFOX_CONFIG_ERROR
            })
        }, function () {
            o(function () {
                e.roomState = s.CAMERA_ACCESS_DENIED
            })
        })
    }, y = function () {
        angular.element("video").each(function (e, t) {
            o(function () {
                t.play()
            }, 50)
        })
    };
    e.$on("$destroy", function () {
        a.leaveRoom();
        var e = angular.element(document).find("body")[0];
        e.style.display = "none", e.offsetHeight = e.offsetHeight, e.style.display = "block", i.controller = ""
    }), e.roomState = s.WAITING_FOR_ACCESS
}]), angular.module("videoconference").controller("chromeNotifierController", ["$scope", "RoomService", function (e, t) {
    e.hasExtension = !1, e.followedRooms = {}, e.isRoomFollowed = !1;
    var n = function (e, t, n) {
        window.postMessage({type: "ChromeNotifierAction", action: e, argument: t, callback: n}, "*")
    }, o = function () {
        e.hasExtension !== !0 && n("check-extension", void 0, "check-extension")
    }, r = function () {
        n("get-followed-rooms", void 0, "get-followed-rooms")
    };
    window.addEventListener("message", function (n) {
        n.source === window && void 0 !== n.data && ("ChromeNotifierInjected" === n.data.type ? o() : "ChromeNotifierResponse" === n.data.type && e.$apply(function () {
            switch (n.data.callback) {
                case"check-extension":
                    e.hasExtension = !0, console.log("Chrome notifier version " + n.data.response + " detected"), r();
                    break;
                case"get-followed-rooms":
                    e.followedRooms = n.data.response, e.isRoomFollowed = t.roomName in e.followedRooms
            }
        }))
    });
    var i = function (e) {
        return function (t) {
            n(e, t), r()
        }
    };
    e.follow = i("follow-room"), e.unfollow = i("unfollow-room"), e.mute = i("mute-room"), e.unmute = i("unmute-room"), e.toggleRoomFollowed = function () {
        t.roomName in e.followedRooms ? e.unfollow(t.roomName) : e.follow(t.roomName)
    }, o()
}]), angular.module("videoconference").factory("RoomService", ["RTCManager", "serverSocket", "Event", "Client", "Stream", "State", "$rootScope", "$timeout", "Analytics", function (e, t, n, o, r, i, a, c, s) {
    var l = {};
    l.selfId = "", l.clients = [], l.roomData = {}, l.roomName = "", l.roomPassword = "", l.selfStream = {}, l.owners = [], l.isPopularRoom = void 0;
    var d;
    l.getLocalClient = function () {
        return d
    }, l.shareScreen = function (n) {
        l.setLocalVideoEnabled(!1), d.newStream(r.type.SCREEN_SHARE).setup(n).setStatus({status: r.status.CONNECTION_SUCCESSFUL}), d.isScreenSharingEnabled = !0;
        var o = 1;
        n.onended = function () {
            t.emit(protocol.req.END_STREAM, {endedStream: o}), d.isScreenSharingEnabled = !1, d.removeStreamByType(r.type.SCREEN_SHARE), e.disconnectConnection(!0, o, null, l.clients), d.userHasExplicitlyDisabledVideo || l.setLocalVideoEnabled(!0)
        }, t.emit(protocol.req.START_NEW_STREAM), e.addNewStream(n, o)
    }, l.setLocalAudioEnabled = function (e) {
        t.emit(protocol.req.ENABLE_AUDIO, {enabled: e}), d.setAudioEnabled(e)
    }, l.setLocalVideoEnabled = function (e) {
        d.isScreenSharingEnabled || (t.emit(protocol.req.ENABLE_VIDEO, {enabled: e}), d.setVideoEnabled(e))
    }, a.$on("client_connection_status_changed", function (e, t) {
        var n = f(t.clientId).streams[t.streamId];
        n.setStatus(t)
    }), a.$on("preparing_new_stream", function (e, t) {
        if (t.clientId !== l.selfId) {
            var n, o = f(t.clientId);
            n = 0 === t.streamId ? r.type.CAMERA : r.type.SCREEN_SHARE;
            for (var i = o.newStream(n, t.streamId), a = 0; t.total_number_of_attempts > a; a++)i.addConnectionAttempt(t, a)
        }
    }), l.setupConnectionManager = function (n) {
        e.setup(l.roomData.name, l.selfId, n, t, m, v)
    }, l.addOwner = function (e, n) {
        t.emit(protocol.req.ADD_OWNER, {password: e, email: n})
    }, l.setLock = function (e) {
        t.emit(protocol.req.SET_LOCK, {locked: e})
    }, l.getRoomInformation = function () {
        l.roomName && t.emit(protocol.req.JOIN_ROOM, {roomName: l.roomName, password: l.roomPassword}).once(protocol.res.ROOM_JOINED, function (e) {
            return e.error ? (a.$broadcast(n.ROOM_JOINED, e), void 0) : (l.roomData = e.room, l.owners = e.room.owners, l.selfId = e.selfId, l.maximumTTL = e.maximumTTL, l.isPopularRoom = e.room.isPopular, l.setupConnectionManager(l.selfStream), l.roomData.clients.forEach(function (t) {
                var n = new o(t);
                g(n), t.id === e.selfId && (d = n)
            }), h(), S(), u(), a.$broadcast(n.ROOM_JOINED), void 0)
        })
    };
    var u = function () {
        t.on(protocol.res.NEW_CLIENT,function (e) {
            g(new o(e.client, !1)), a.$apply(function () {
                a.$broadcast(n.NEW_CLIENT)
            })
        }).on(protocol.res.CLIENT_LEFT,function (e) {
            var t, o = e.client.id;
            l.clients.forEach(function (e, n) {
                e.id === o && (e.disconnect(), t = n)
            }), void 0 !== t && l.clients.splice(t, 1), a.$apply(function () {
                a.$broadcast(n.CLIENT_LEFT)
            })
        }).on(protocol.res.NEW_STREAM_STARTED,function (t) {
            function n(e) {
                return e && e.url && e.url.indexOf("turn:") >= 0
            }

            t.iceServers && t.iceServers.iceServers && !t.iceServers.iceServers.some(n) && s.sendAnalytics("event", "RTC", "Data from server", "TURN server not supplied"), a.$apply(function () {
                e.setIceServers(t.client.id, t.iceServers), e.connect(t.client.id, !0, t.streamId, 1, !1)
            })
        }).on(protocol.res.STREAM_ENDED,function (t) {
            a.$apply(function () {
                var n = f(t.client.id);
                n.removeStream(t.streamId), e.disconnectConnection(!1, t.streamId, n.id, null)
            })
        }).on(protocol.res.AUDIO_ENABLED,function (e) {
            a.$apply(function () {
                var t = f(e.clientId);
                t.isAudioEnabled = e.isAudioEnabled, t.streams[0].isAudioEnabled = e.isAudioEnabled
            })
        }).on(protocol.res.VIDEO_ENABLED,function (e) {
            a.$apply(function () {
                var t = f(e.clientId);
                t.isVideoEnabled = e.isVideoEnabled, t.streams[0].isVideoEnabled = e.isVideoEnabled
            })
        }).on(protocol.res.OWNERS_CHANGED,function (e) {
            return e.error ? (a.$apply(function () {
                a.$broadcast("owners_changed:error", e)
            }), void 0) : (a.$apply(function () {
                l.roomData.passwordSet = !0, l.owners = e.owners
            }), void 0)
        }).on(protocol.res.ROOM_LOCKED, function (e) {
            e.error && a.$apply(function () {
                a.$broadcast("room_locked:error", e)
            }), a.$apply(function () {
                l.roomData.isLocked = e.isLocked
            })
        })
    }, m = function (e, t, n) {
        var o = f(e);
        void 0 !== o && ("error" === n ? o.streams[t].error = !0 : void 0 !== o.streams[t] && null !== o.streams[t] && (o.streams[t].ready = !0))
    }, f = function (e) {
        var t = l.clients.reduce(function (t, n) {
            return n.id === e ? n : t
        }, null);
        return t
    }, p = function (e, t, n) {
        var o = f(e);
        o.addStreamData(n, t), o.isLocalClient && o.setStreamReady(n)
    }, g = function (e) {
        l.clients.push(e)
    }, h = function () {
        d.newStream(r.type.CAMERA).setStatus({status: r.status.CONNECTION_SUCCESSFUL}), p(d.id, l.selfStream, 0)
    }, v = function (e, t, n) {
        p(e, t, n)
    }, C = 60, E = null, S = function () {
        E = window.setTimeout(function () {
            var e = l.clients.length;
            s.setDimension("dimension5", e), s.sendAnalytics("event", "Room", "Minute elapsed", "Minute elapsed in conversation", e), S()
        }, 1e3 * C)
    }, N = function () {
        null !== E && window.clearTimeout(E)
    };
    return l.leaveRoom = function () {
        N(), t.emit(protocol.req.LEAVE_ROOM), t.removeAllListeners(), l.selfStream.stop(), e.disconnectAll()
    }, l
}]), angular.module("videoconference").factory("Analytics", function () {
    var e = function (e, t, n, o, r) {
        ga("send", e, t, n, o, r)
    }, t = function (e, t) {
        ga("set", e, t)
    };
    return{sendAnalytics: e, send: e, setDimension: t}
}), angular.module("videoconference").factory("RTCManager", ["$rootScope", "$timeout", "Analytics", "ConnectionStatus", function (e, t, n, o) {
    function r() {
    }

    function i(e, t) {
        void 0 === t[e] && (t[e] = {iceServers: [
            {url: "stun:stun.l.google.com:19302"}
        ], receivingConnections: {}, sendingConnections: {}})
    }

    function a(e, t, n, o) {
        return n ? o[e].receivingConnections[t] : o[e].sendingConnections[t]
    }

    var c = "event", s = "RTC", l = "Connection", d = 5e3;
    r.prototype.setup = function (e, t, n, o, r, i) {
        this.serverSocket = o, this.selfId = t, this.roomName = e, this.peerConnections = {}, this.localStreams = [n], this.statusCallback = r, this.streamCallback = i, this.mediaConstraints = {optional: [
            {DtlsSrtpKeyAgreement: !0}
        ]}, this.sdpConstraints = {mandatory: {OfferToReceiveAudio: !0, OfferToReceiveVideo: !0}}, this.setupSocketListeners()
    }, r.prototype.addNewStream = function (e, t) {
        this.localStreams[t] = e
    }, r.prototype.setIceServers = function (e, t) {
        i(e, this.peerConnections), this.peerConnections[e].iceServers = t
    };
    var u = function (n) {
        t(function () {
            var t;
            if (void 0 === n.status)switch (n.attemptNumber) {
                case 1:
                    t = "connecting_to_client";
                    break;
                case 2:
                    t = "connecting_from_client";
                    break;
                case 3:
                    t = "connecting_through_turn_1";
                    break;
                case 4:
                    t = "connecting_through_turn_2";
                    break;
                case 5:
                    t = "connecting_through_turn_3";
                    break;
                case 6:
                    t = "connecting_through_turn_4"
            } else t = n.status;
            e.$broadcast(o.event.CLIENT_CONNECTION_STATUS_CHANGED, {clientId: n.clientId, streamId: n.streamId, status: t, attemptNumber: n.attemptNumber})
        })
    };
    return r.prototype.connect = function (r, a, m, f, p, g) {
        g ? n.sendAnalytics(c, s, l, "Reconnecting") : 1 === f && (function () {
            p && 0 !== m || e.$broadcast(o.event.PREPARING_NEW_STREAM, {clientId: r, streamId: m, total_number_of_attempts: 6})
        }(), n.sendAnalytics(c, s, l, "Connection started")), i(r, this.peerConnections);
        var h, v = this.peerConnections[r].iceServers;
        if (3 > f) {
            var C = 0;
            h = {iceServers: []};
            for (var E = 0; v.iceServers.length > E; E++)-1 === v.iceServers[E].url.indexOf("turn") && (h.iceServers[C++] = v.iceServers[E])
        } else h = v;
        var S, N, _ = function (e, n, i) {
            if (i) {
                var a = "connected" === e || "completed" === e || "failed" === e || "disconnected" === e;
                return a && this.serverSocket.emit(protocol.relay.CONNECTION_QUERY, {receiverId: r, streamId: m, attemptNumber: f, sending: p, isReconnecting: g}), a
            }
            switch (n) {
                case"disconnected":
                case"failed":
                    switch (e) {
                        case"connected":
                        case"completed":
                            u({clientId: r, status: o.status.CONNECTION_SUCCESSFUL, attemptNumber: -1, streamId: m}), t.cancel(S), S = null
                    }
                    break;
                case"connected":
                case"completed":
                    switch (e) {
                        case"disconnected":
                        case"failed":
                            u({clientId: r, status: o.status.CONNECTION_DISCONNECTED, attemptNumber: -1, streamId: m}), S = t(function () {
                                this.serverSocket.emit(protocol.req.RESTART_STREAM, {receiverId: r, streamId: m, sending: p, attemptNumber: f})
                            }.bind(this), d + 1e3 * Math.random())
                    }
            }
            return!1
        }.bind(this);
        (!a || g) && (N = function () {
            !g && 6 > f ? this.restartConnection(r, m, a, !p, f + 1) : (this.serverSocket.emit(protocol.relay.CONNECTION_FAILED, {receiverId: r, streamId: m, attemptNumber: f, sending: p, isReconnecting: g}), u({clientId: r, status: o.status.CONNECTION_FAILED, attemptNumber: -1, streamId: m}), this.sendErrorCallback(r, m, p, g))
        }.bind(this));
        var w = this.startNewPeerConnection(r, m, p || 0 === m, h, f, _, N);
        (p || 0 === m) && (w.addStream(this.localStreams[m]), this.peerConnections[r].sendingConnections[m] = w), p && 0 !== m || (this.peerConnections[r].receivingConnections[m] = w), a && this.serverSocket.emit(protocol.relay.READY_TO_RECEIVE_OFFER, {receiverId: r, iceServers: v, streamId: m, attemptNumber: f, sending: p, isReconnecting: g}), p && 0 !== m || u({clientId: r, attemptNumber: f, streamId: m})
    }, r.prototype.startNewPeerConnection = function (e, o, r, i, a, u, m) {
        var f, p = function () {
            f && t.cancel(f), m && (f = t(function () {
                f = null, m()
            }, d))
        }.bind(this), g = new RTCPeerConnection(i, this.mediaConstraints), h = g.signalingState, v = g.iceConnectionState;
        return g.onnegotiationneeded = function () {
            this.serverSocket.emit("webrtc", {event: "onnegotiationneeded", receiverId: e, streamId: o, sending: r})
        }.bind(this), g.onicecandidate = function (t) {
            t.candidate && this.serverSocket.emit("ice_candidate", {message: t.candidate, receiverId: e, streamId: o, sending: r})
        }.bind(this), g.onaddstream = function (t) {
            this.streamCallback(e, t.stream, o, a)
        }.bind(this), g.onsignalingstatechange = function () {
            this.serverSocket.emit("webrtc", {event: "onsignalingstatechange", receiverId: e, streamId: o, sending: r, previousState: h, currentState: g.signalingState}), h = g.signalingState, f && p()
        }.bind(this), g.oniceconnectionstatechange = function () {
            var i = u(g.iceConnectionState, v, f ? !0 : !1);
            f && (i ? (t.cancel(f), f = null) : p());
            var a = !("new" === v && "checking" === g.iceConnectionState || "new" === v && "connected" === g.iceConnectionState || "checking" === v && "connected" === g.iceConnectionState || "closed" === g.iceConnectionState);
            this.serverSocket.emit("webrtc", {event: "oniceconnectionstatechange", receiverId: e, streamId: o, sending: r, previousState: v, currentState: g.iceConnectionState, interesting: a}), a && n.sendAnalytics(c, s, l, "Connection state changed: " + v + " to " + g.iceConnectionState), v = g.iceConnectionState
        }.bind(this), p(), g
    }, r.prototype.setupSocketListeners = function () {
        var e = this, n = this.serverSocket;
        n.on(protocol.relay.CONNECTION_QUERY, function (r) {
            t(function () {
                var t = a(r.clientId, r.streamId, r.sending, e.peerConnections);
                return void 0 === t ? (e.restartConnection(r.clientId, r.streamId, !1, r.sending, r.attemptNumber), void 0) : ("connected" === t.iceConnectionState ? (u({clientId: r.clientId, status: o.status.CONNECTION_SUCCESSFUL, attemptNumber: -1, streamId: r.streamId}), n.emit(protocol.relay.CONNECTION_STATUS_CONNECTED, {receiverId: r.clientId, streamId: r.streamId, attemptNumber: r.attemptNumber, sending: !r.sending, isReconnecting: r.isReconnecting}), e.statusCallback(r.clientId, r.streamId, "success"), e.sendSuccessAnalytics(r.attemptNumber, r.isReconnecting)) : r.isReconnecting || 6 === r.attemptNumber ? (u({clientId: r.clientId, status: o.status.CONNECTION_FAILED, attemptNumber: -1, streamId: r.streamId}), n.emit(protocol.relay.CONNECTION_FAILED, {receiverId: r.clientId, streamId: r.streamId, attemptNumber: r.attemptNumber, sending: !r.sending, isReconnecting: r.isReconnecting}), e.sendErrorCallback(r.clientId, r.streamId, !r.sending)) : n.emit(protocol.relay.CONNECTION_STATUS_NOT_CONNECTED, {receiverId: r.clientId, streamId: r.streamId, attemptNumber: r.attemptNumber, sending: !r.sending, active: r.active, isReconnecting: r.isReconnecting}), void 0)
            }, 200)
        }), n.on(protocol.relay.CONNECTION_STATUS_CONNECTED, function (t) {
            0 === t.streamId && u({clientId: t.clientId, status: o.status.CONNECTION_SUCCESSFUL, attemptNumber: -1, streamId: t.streamId}), e.sendSuccessAnalytics(t.attemptNumber, t.isReconnecting), e.statusCallback(t.clientId, t.streamId, "success")
        }), n.on(protocol.relay.CONNECTION_STATUS_NOT_CONNECTED, function (t) {
            t.isReconnecting || e.restartConnection(t.clientId, t.streamId, t.active, !t.sending, t.attemptNumber + 1)
        }), n.on(protocol.relay.CONNECTION_FAILED, function (t) {
            e.sendErrorCallback(t.clientId, t.streamId, !t.sending, t.isReconnecting), u({clientId: t.clientId, status: o.status.CONNECTION_FAILED, attemptNumber: -1, streamId: t.streamId})
        }), n.on(protocol.relay.READY_TO_RECEIVE_OFFER, function (t) {
            e.setIceServers(t.clientId, t.iceServers);
            var o = a(t.clientId, t.streamId, t.sending, e.peerConnections);
            void 0 !== o ? e.restartConnection(t.clientId, t.streamId, !0, t.sending, t.attemptNumber, t.isReconnecting) : e.connect(t.clientId, !1, t.streamId, t.attemptNumber, !t.sending || 0 === t.streamId, t.isReconnecting), o = a(t.clientId, t.streamId, t.sending, e.peerConnections), o.createOffer(function (e) {
                o.setLocalDescription(e, function () {
                    n.emit("sdp_offer", {message: o.localDescription, receiverId: t.clientId, streamId: t.streamId, sending: !t.sending})
                }, function (e) {
                    console.log("Could not set local description from local offer: " + e.name + "(" + e.message + ")")
                })
            }, function (e) {
                console.log("Could not create local offer: " + e.name + "(" + e.message + ")")
            }, e.sdpConstraints)
        }), n.on("ice_candidate", function (t) {
            var n = a(t.clientId, t.streamId, t.sending, e.peerConnections);
            return void 0 === n ? (e.restartConnection(t.clientId, t.streamId, !1, t.sending, t.attemptNumber), void 0) : (n.addIceCandidate(new RTCIceCandidate(t.message)), void 0)
        });
        var r = this.sdpConstraints;
        n.on("sdp_offer", function (t) {
            var o = a(t.clientId, t.streamId, t.sending, e.peerConnections);
            return void 0 === o ? (e.restartConnection(t.clientId, t.streamId, !1, t.sending, t.attemptNumber), void 0) : (o.setRemoteDescription(new RTCSessionDescription(t.message), function () {
                o.createAnswer(function (e) {
                    o.setLocalDescription(e, function () {
                        n.emit("sdp_answer", {message: o.localDescription, receiverId: t.clientId, streamId: t.streamId, sending: !t.sending})
                    }, function (e) {
                        console.log("Could not set local description from local answer: " + e.name + "(" + e.message + ")")
                    })
                }, function (e) {
                    console.log("Could not create answer to remote offer: " + e.name + "(" + e.message + ")")
                }, r)
            }, function (e) {
                console.log("Could not set remote description from remote offer: " + e.name + "(" + e.message + ")")
            }), void 0)
        }), n.on("sdp_answer", function (t) {
            var n = a(t.clientId, t.streamId, t.sending, e.peerConnections);
            return void 0 === n ? (e.restartConnection(t.clientId, t.streamId, !1, t.sending, t.attemptNumber), void 0) : (n.setRemoteDescription(new RTCSessionDescription(t.message), function () {
            }, function (e) {
                console.log("Could not set remote description from remote answer: " + e.name + "(" + e.message + ")")
            }), void 0)
        }), n.on(protocol.res.STREAM_RESTARTED, function (t) {
            "error"in t || (e.setIceServers(t.iceServers), e.restartConnection(t.receiverId, t.streamId, !1, t.sending, t.attemptNumber, !0))
        })
    }, r.prototype.disconnectConnection = function (e, t, n, o) {
        e ? o.forEach(function (e) {
            e.id !== this.selfId && (this.disconnect(this.peerConnections[e.id].sendingConnections[t]), delete this.peerConnections[e.id].sendingConnections[t])
        }, this) : (this.disconnect(this.peerConnections[n].receivingConnections[t]), delete this.peerConnections[n].receivingConnections[t])
    }, r.prototype.disconnect = function (e) {
        try {
            e.close()
        } catch (t) {
        }
    }, r.prototype.disconnectAll = function () {
        for (var e in this.peerConnections)this.disconnectAllConnectionsForClient(e);
        this.peerConnections = {}
    }, r.prototype.disconnectAllConnectionsForClient = function (e) {
        for (var t in this.peerConnections[e].sendingConnections) {
            var n = parseInt(t, 10);
            this.disconnect(this.peerConnections[e].sendingConnections[n]), delete this.peerConnections[e].sendingConnections[n]
        }
        for (var o in this.peerConnections[e].receivingConnections) {
            var r = parseInt(o, 10);
            0 !== r && (this.disconnect(this.peerConnections[e].receivingConnections[r]), delete this.peerConnections[e].receivingConnections[r])
        }
        delete this.peerConnections[e]
    }, r.prototype.sendErrorCallback = function (e, t, o, r) {
        n.sendAnalytics(c, s, l, r ? "Reconnection failed" : "Connection failed"), o && 0 !== t || this.statusCallback(e, t, "error")
    }, r.prototype.sendSuccessAnalytics = function (e, t) {
        var o = t ? "Reconnected" : "Connection established";
        o += e > 2 ? " with TURN" : " without TURN", n.sendAnalytics(c, s, l, o, e), n.setDimension("dimension6", e)
    }, r.prototype.restartConnection = function (e, t, n, o, r, i) {
        var c = a(e, t, o, this.peerConnections);
        if (void 0 !== c) {
            try {
                c.close()
            } catch (s) {
                console.log("Error while closing peer connection: " + s)
            }
            (o || 0 === t) && delete this.peerConnections[e].receivingConnections[t], o && 0 !== t || delete this.peerConnections[e].sendingConnections[t]
        }
        this.connect(e, !n, t, r, !o || 0 === t, i)
    }, new r
}]), angular.module("videoconference").factory("Chat", ["$rootScope", "$document", "serverSocket", "RoomService", "Analytics", function (e, t, n, o, r) {
    var i = 0, a = ["#5E71B6", "#90D2B6", "#1C1638", "#FEFFB8", "#4C806D"], c = angular.element("#chat-messages"), s = function (e) {
        e && (this.text = e.message || "", this.senderId = e.senderId || o.selfId, this.client = this.getClient(), this.client.color = this.client.color || a[i++], i >= a.length && (i = 0), this.picture = l(this.senderId))
    };
    s.prototype.getClient = function () {
        var e = o.getLocalClient();
        return angular.forEach(o.clients, function (t) {
            t.id === this.senderId && (e = t)
        }.bind(this)), e
    };
    var l = function (e) {
        try {
            var n = t[0].getElementById(e), o = t[0].getElementById("chat-paint-canvas"), r = o.getContext("2d");
            return r.drawImage(n, 0, 0, 240, 240), o.toDataURL()
        } catch (i) {
            return null
        }
    }, d = {};
    return d.messages = [], d.sendMessage = function (e) {
        n.emit(protocol.relay.CHAT_MESSAGE, {message: e}), d.messages.push(new s({message: e})), r.sendAnalytics("event", "Room", "Chat", "Message sent")
    }, n.on(protocol.relay.CHAT_MESSAGE, function (t) {
        t && !t.error && (e.$apply(function () {
            d.messages.push(new s(t)), e.$broadcast("new_chat_message", t)
        }), d.updateChatWindow())
    }), d.updateChatWindow = function (e) {
        var t = c.height(), n = c.scrollTop(), o = c[0].scrollHeight, r = 14, i = 50, a = e || r + 2 * i > o - t - n;
        a && c.scrollTop(9999999)
    }, d
}]), angular.module("videoconference").factory("Stream", ["$rootScope", "$window", "$sce", function (e, t, n) {
    var o = function (e, t) {
        this.id = e, this.type = t, this.isFullScreen = !1, this.ready = !1, this.error = !1, this.orientation = o.orientation.LANDSCAPE, this.status = o.status.CONNECTING, this.cuteStatus = "Establishing connection", this.connectionAttempts = [], this.isAudioEnabled = !0, this.isVideoEnabled = !0
    };
    o.status = {CONNECTING: "connecting", CONNECTING_TO_CLIENT: "connecting_to_client", CONNECTING_FROM_CLIENT: "connecting_from_client", CONNECTING_THROUGH_TURN_1: "connecting_through_turn_1", CONNECTING_THROUGH_TURN_2: "connecting_through_turn_2", CONNECTING_THROUGH_TURN_3: "connecting_through_turn_3", CONNECTING_THROUGH_TURN_4: "connecting_through_turn_4", CONNECTION_FAILED: "connection_failed", CONNECTION_SUCCESSFUL: "connection_successful", CONNECTION_DISCONNECTED: "connection_disconnected"}, o.cuteStatus = {1: "Right! Let's get you connected", 2: "Sometimes the other end has to connect to us", 3: "Applying our Secret Sauce", 4: "Again, sometimes the other end has to apply the sauce", 5: "Sometimes it only works when using the spicy recipe", 6: "Last chance. If this doesn't work, nothing will", failed: "We're really sorry, but we are not able to connect you. There might be a problem with your network. See our FAQ for tips on how to resolve this, or contact us at feedback@appear.in"}, o.type = {CAMERA: "camera", SCREEN_SHARE: "screen_share"}, o.orientation = {LANDSCAPE: "landscape", PORTRAIT: "portrait"}, o.prototype.setup = function (e) {
        return this.url = n.trustAsResourceUrl(t.URL.createObjectURL(e)), this.stream = e, this
    }, o.prototype.setConnectionAttempt = function (e, t) {
        void 0 !== t && (this.connectionAttempts[t - 1].status = "failed"), this.currentConnectionAttempt = e, this.connectionAttempts[e - 1].status = "active"
    }, o.prototype.setStatus = function (t) {
        switch (this.status = t.status, t.status) {
            case o.status.CONNECTION_FAILED:
                this.cuteStatus = o.cuteStatus.failed;
                break;
            case o.status.CONNECTION_SUCCESSFUL:
            case o.status.CONNECTION_DISCONNECTED:
                e.$apply();
                break;
            default:
                this.setConnectionAttempt(t.attemptNumber, this.currentConnectionAttempt), this.cuteStatus = o.cuteStatus[this.currentConnectionAttempt]
        }
        this.previousAttempt = t.currentConnectionAttempt
    }, o.prototype.addConnectionAttempt = function (e, t) {
        this.connectionAttempts.push(new r("waiting", t + 1))
    }, o.prototype.setVideoEnabled = function (e) {
        this.stream.getVideoTracks().forEach(function (t) {
            t.enabled = e
        }), this.isVideoEnabled = e
    }, o.prototype.setAudioEnabled = function (e) {
        this.stream.getAudioTracks().forEach(function (t) {
            t.enabled = e
        }), this.isAudioEnabled = e
    }, o.prototype.setReady = function () {
        this.ready = !0
    }, o.prototype.setOrientation = function (e) {
        this.orientation = e
    };
    var r = function () {
        function e(e, t) {
            this.status = status, this.attemptNumber = t
        }

        return e
    }();
    return o
}]), angular.module("videoconference").factory("Client", ["Stream", "RTCManager", function (e, t) {
    var n = function (e) {
        this.isLocalClient = t.selfId === e.id, this.id = e.id, this.name = e.name, this.isVideoEnabled = e.isVideoEnabled, this.isAudioEnabled = e.isAudioEnabled, this.isScreenSharingEnabled = !1, this.numberOfStreams = 0, this.streams = [], this.userHasExplicitlyDisabledVideo = !1
    };
    return n.prototype.stopScreenShare = function () {
        this.removeStreamByType(e.type.SCREEN_SHARE)
    }, n.prototype.setAudioEnabled = function (e) {
        this.isAudioEnabled = e, this.streams.forEach(function (t) {
            t.setAudioEnabled(e)
        })
    }, n.prototype.setVideoEnabled = function (e) {
        this.isVideoEnabled = e, this.streams[0].setVideoEnabled(e)
    }, n.prototype.addStreamData = function (e, t) {
        this.streams.forEach(function (n) {
            n.id === e && n.setup(t)
        })
    }, n.prototype.newStream = function (t) {
        var n = this.streams.length, o = new e(n, t);
        return 0 !== n || this.isVideoEnabled || (o.isVideoEnabled = !1), this.streams.push(o), this.numberOfStreams++, o
    }, n.prototype.removeStream = function (e) {
        this.streams.forEach(function (t, n) {
            t.id === e && (this.streams.splice(n, 1), this.numberOfStreams--)
        }, this)
    }, n.prototype.removeStreamByType = function (e) {
        this.streams.forEach(function (t, n) {
            t.type === e && (this.streams.splice(n, 1), this.numberOfStreams--, t.stream.stop())
        }, this)
    }, n.prototype.setStreamReady = function (e) {
        this.streams.forEach(function (t) {
            t.id === e && t.setReady()
        })
    }, n.prototype.disconnect = function () {
        t.disconnectAllConnectionsForClient(this.id)
    }, n
}]), angular.module("videoconference").filter("localClientFilter", ["RoomService", function (e) {
    return function (t) {
        var n = [];
        return angular.forEach(t, function (t) {
            t.id !== e.selfId && n.push(t)
        }), n
    }
}]), angular.module("videoconference").factory("Event", function () {
    return{STATE_CHANGED: "state_changed", LOCAL_CAMERA_TOGGLED: "local_camera_toggled", LOCAL_MICROPHONE_TOGGLED: "local_microphone_toggled", LOCAL_SCREENSHARE_TOGGLED: "local_screenshare_toggled", CLIENT_LEFT: "client_left", NEW_CLIENT: "new_client"}
}), angular.module("videoconference").factory("State", function () {
    return{WAITING_FOR_ACCESS: "waiting_for_access", WAITING_FOR_ROOM_INFORMATION: "waiting_for_room_information", PLEASE_GRANT_ACCESS: "please_grant_access", CAMERA_ACCESS_DENIED: "camera_access_denied", FIREFOX_CONFIG_ERROR: "firefox_config_error", ROOM_LOCKED: "room_locked", READY: "ready", DISCONNECTING_CLIENT: "disconnecting_client"}
}), angular.module("videoconference").factory("ConnectionStatus", function () {
    return{event: {CLIENT_CONNECTION_STATUS_CHANGED: "client_connection_status_changed", PREPARING_NEW_STREAM: "preparing_new_stream"}, status: {CONNECTION_FAILED: "connection_failed", CONNECTION_SUCCESSFUL: "connection_successful", CONNECTION_DISCONNECTED: "connection_disconnected"}}
}), function (e) {
    e.req = {JOIN_ROOM: "join_room", LEAVE_ROOM: "leave_room", START_WATCH: "start_watch", END_WATCH: "end_watch", START_NEW_STREAM: "start_new_stream", RESTART_STREAM: "restart_stream", END_STREAM: "end_stream", ADD_OWNER: "add_owner", ENABLE_AUDIO: "enable_audio", ENABLE_VIDEO: "enable_video", SET_LOCK: "set_lock"}, e.res = {ROOM_JOINED: "room_joined", WATCH_STARTED: "watch_started", WATCH_ENDED: "watch_ended", NEW_CLIENT: "new_client", CLIENT_LEFT: "client_left", NEW_STREAM_STARTED: "new_stream_started", STREAM_RESTARTED: "stream_restarted", STREAM_ENDED: "stream_ended", OWNERS_CHANGED: "owners_changed", AUDIO_ENABLED: "audio_enabled", VIDEO_ENABLED: "video_enabled", ROOM_LOCKED: "room_locked"}, e.err = {INVALID_ROOM_NAME: "invalid_room_name", ROOM_LOCKED: "room_locked"}, e.relay = {READY_TO_RECEIVE_OFFER: "ready_to_receive_offer", SDP_OFFER: "sdp_offer", SDP_ANSWER: "sdp_answer", ICE_CANDIDATE: "ice_candidate", CONNECTION_QUERY: "connection_query", CONNECTION_STATUS_NOT_CONNECTED: "connection_status_not_connected", CONNECTION_STATUS_CONNECTED: "connection_status_connected", CONNECTION_FAILED: "connection_failed", WEBRTC: "webrtc", CHAT_MESSAGE: "chat_message"}
}("undefined" == typeof exports ? this.protocol = {} : exports), function (e) {
    e.requirements = "the room name cannot start with / or one of these reserved words: templates, styles, scripts, libraries, images, information, error.", e.pattern = "(?!templates|styles|scripts|libraries|images|information|error)[^/](.*)"
}("undefined" == typeof exports ? this._RoomName = {} : exports), angular.module("videoconference").factory("RoomName", ["$window", function (e) {
    return e._RoomName
}]);
var getFullScreen, isFullScreen, cancelFullScreen, fullScreenHandler;
document.webkitCancelFullScreen ? (getFullScreen = function (e) {
    e.webkitRequestFullScreen()
}, isFullScreen = function () {
    return document.webkitIsFullScreen
}, cancelFullScreen = function () {
    document.webkitCancelFullScreen()
}, fullScreenHandler = function (e) {
    return document.onwebkitfullscreenchange = function (t) {
        void 0 !== t && (t.target === angular.element(document).find("body")[0] ? (e.screenToggled = !e.screenToggled, e.$apply()) : isFullScreen() || e.cancelVideoFullscreen(jQuery(t.target)))
    }
}) : document.mozCancelFullScreen && (getFullScreen = function (e) {
    e.mozRequestFullScreen()
}, isFullScreen = function () {
    return document.mozFullScreen
}, cancelFullScreen = function () {
    document.mozCancelFullScreen()
}, fullScreenHandler = function (e) {
    return document.onmozfullscreenchange = function (t) {
        void 0 !== t && (t.target === angular.element(document).find("body")[0] ? (e.screenToggled = !e.screenToggled, e.$apply()) : isFullScreen() || e.cancelVideoFullscreen(jQuery(t.target)))
    }
});
var splitscreenElements = function () {
    var e = [], t = null, n = function () {
        null !== t && t()
    }, o = function (e) {
        (0 === e.videoWidth || 0 === e.videoHeight) && window.setTimeout(function () {
            return 0 === e.videoWidth || 0 === e.videoHeight ? (o(e), void 0) : (n(), void 0)
        }, 100)
    };
    return{setUpdateHandler: function (e) {
        t = e
    }, getElementCount: function () {
        return e.length
    }, getElementByOrdinality: function (t) {
        return e[t]
    }, registerElement: function (t) {
        e.unshift(t), void 0 !== t.find("video")[0] && o(t.find("video")[0]), n()
    }, unregisterElement: function (t) {
        for (var o in e)if (e[o][0] === t[0])return e.splice(o, 1), n(), void 0
    }}
}, splitscreenLayouts = function () {
    var e = 640, t = 480, n = 0, o = 1, r = 100, i = function (n) {
        var o, r, i, a, c = 0, s = null;
        return{recalculate: function (e, t, n, s, l) {
            o = t + c, r = n + c, i = s - 2 * c, a = l - 2 * c
        }, utilization: function () {
            var n = e, o = t;
            return n / o > i / a ? n * o * i * i / n / n : n * o * a * a / o / o
        }, positionElements: function (c) {
            s = c.getElementByOrdinality(n);
            var l = s.find("video")[0], d = void 0 === l ? 0 : l.videoWidth, u = void 0 === l ? 0 : l.videoHeight;
            (0 === d || 0 === u) && (d = e, u = t);
            var m, f;
            d / u > i / a ? (m = i, f = u * i / d) : (f = a, m = d * a / u);
            var p = o + (i - m) / 2, g = r + (a - f) / 2;
            s.css("position", "absolute"), s.css("left", p + "px"), s.css("top", g + "px"), s.css("width", m + "px"), s.css("height", f + "px"), s.css("font-size", m / 50 + "pt"), s.trigger("splitscreen-resize", [m, f]), window.setTimeout(function () {
                s.css("transition", "left 0.5s, top 0.5s, width 0.5s, height 0.5s, font-size 0.5s")
            }, 0)
        }, getLeafCount: function () {
            return 1
        }}
    }, a = function (e, t, n) {
        var o = [], a = c(e, t, o), s = function (e) {
            for (e -= n; o.length > e;)o.pop();
            for (; e > o.length;)o.push(i(n + o.length))
        };
        return{recalculate: function (e, t, n, o, r) {
            return s(e), a.recalculate(e, t, n, o, r)
        }, utilization: function () {
            return a.utilization()
        }, positionElements: function (e) {
            a.positionElements(e)
        }, getLeafCount: function () {
            return r
        }}
    }, c = function (e, t, r) {
        return{recalculate: function (i, a, c, s, l) {
            for (var d, u, m, f, p = [], g = 0, h = 1, v = 0; r.length > v; v++)p.push(h), g += h, h *= t;
            for (var C in r) {
                var E = r[C], S = p[C] / g;
                e === n ? (u = l, d = s * S, m = d, f = 0) : e === o && (u = l * S, d = s, m = 0, f = u), E.recalculate(i, a, c, d, u), a += m, c += f
            }
        }, utilization: function () {
            var e = 0;
            for (var t in r)e += r[t].utilization();
            return e
        }, positionElements: function (e) {
            for (var t in r)r[t].positionElements(e)
        }, getLeafCount: function () {
            var e = 0;
            for (var t in r)e += r[t].getLeafCount();
            return e
        }}
    }, s = {"0-default": {description: "Mixed layout", layouts: [c(n, 1, [i(1), i(0)]), a(o, 1, 0), c(n, 1, [i(1), i(0)]), c(n, 1, [c(o, 1, [i(1), i(2)]), i(0)]), c(o, 1, [c(n, 1, [i(2), i(0)]), c(n, 1, [i(3), i(1)])]), c(n, 2 / 3, [c(o, 1, [i(2), i(3), i(4)]), c(o, 1, [i(0), i(1)])]), c(o, 1, [c(n, 1, [i(2), i(1), i(0)]), c(n, 1, [i(5), i(4), i(3)])]), c(o, 2 / 3, [c(n, 1, [i(2), i(1), i(0)]), c(n, 1, [i(6), i(5), i(4), i(3)])])]}, "1-big-vertical": {description: "Vertical layout", layouts: [c(n, .25, [i(0), a(o, 1, 1)])]}, "2-big-horizontal": {description: "Horizontal layout", layouts: [c(o, .25, [i(0), a(n, 1, 1)])]}}, l = "0-default", d = null, u = function () {
        null !== d && d()
    };
    return{getCategories: function () {
        return s
    }, getCurrentCategory: function () {
        return l
    }, setCurrentCategory: function (e) {
        l = e, u()
    }, setUpdateHandler: function (e) {
        d = e
    }, getBestLayout: function (e, t, n, o, i) {
        var a = null, c = 0, d = s[l].layouts;
        for (var u in d) {
            var m = d[u], f = m.getLeafCount();
            if (!(r > f && f !== e)) {
                m.recalculate(e, t, n, o, i);
                var p = m.utilization();
                (null === a || p > c) && (a = d[u], c = p)
            }
        }
        return a
    }}
}, splitscreenRefresher = function (e, t) {
    var n = null, o = function () {
        null !== n && window.clearTimeout(n), n = window.setTimeout(function () {
            n = null, i()
        }, 100)
    }, r = 0, i = function () {
        var n = e.getElementCount(), o = r, i = 0, a = angular.element(".video-wrapper").width() - r, c = angular.element(".video-wrapper").height(), s = t.getBestLayout(n, o, i, a, c);
        s.positionElements(e, o, i, a, c)
    }, a = !1;
    return{ensureStarted: function () {
        a || (a = !0, i(), e.setUpdateHandler(i), t.setUpdateHandler(i), $(window).resize(o))
    }, setOffset: function (e) {
        r = e, i()
    }, refreshLayout: i}
};
angular.module("videoconference").factory("splitscreenElements", splitscreenElements).factory("splitscreenLayouts", splitscreenLayouts).factory("splitscreenRefresher", ["splitscreenElements", "splitscreenLayouts", splitscreenRefresher]).directive("vcSplitscreen", ["splitscreenElements", "splitscreenRefresher", function (e, t) {
    return function (n, o, r) {
        n.$watch(r.vcSplitscreen, function (t) {
            t === !0 ? e.registerElement(o) : (e.unregisterElement(o), o.removeAttr("style"))
        }), o.bind("$destroy", function () {
            e.unregisterElement(o), o.removeAttr("style")
        }), t.ensureStarted()
    }
}]).directive("vcSplitscreenOffset", ["splitscreenRefresher", function (e) {
    return function (t, n, o) {
        t.$watch(o.vcSplitscreenOffset, function (t) {
            e.setOffset(t)
        })
    }
}]).controller("splitscreenLayoutController", ["$scope", "splitscreenLayouts", function (e, t) {
    e.getCategories = t.getCategories, e.getCurrentCategory = t.getCurrentCategory, e.setCurrentCategory = t.setCurrentCategory
}]);