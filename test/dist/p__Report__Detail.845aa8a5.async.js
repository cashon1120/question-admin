(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[11],{RIjR:function(e,t,a){"use strict";var n=a("fbTi"),i=a("mZ4U");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("m7v9");var s=i(a("TznN"));a("kqFD");var l=i(a("LKgu"));a("Ubc6");var r=i(a("far6"));a("rVLg");var c=i(a("EmQR")),u=i(a("43Yg")),o=i(a("/tCh")),d=i(a("scpF")),f=i(a("O/V9")),p=i(a("8aBX"));a("880f");var m=i(a("lNJz")),v=n(a("i9FB")),h=a("LneV");a("SX54");var k=m.default.confirm,y=function(e){function t(e){var a;return(0,u.default)(this,t),a=(0,d.default)(this,(0,f.default)(t).call(this,e)),a.checkOut=function(){var e=a.props.dispatch,t=a.state.id,n=function(e){e.success&&c.default.success("\u64cd\u4f5c\u6210\u529f")};k({title:"\u5ba1\u6838\u4fe1\u606f",content:"\u5ba1\u6838\u901a\u8fc7\u540e\uff0c\u8003\u751f\u5373\u53ef\u626b\u63cf\u4e8c\u7ef4\u7801\u8003\u8bd5\uff0c\u662f\u5426\u901a\u8fc7\u5ba1\u6838\uff1f",onOk:function(){e&&e({type:"report/del",payload:{id:t},callback:n})}})},a.state={examList:[],id:e.match.params.id,spinLoading:!1},a}return(0,p.default)(t,e),(0,o.default)(t,[{key:"componentDidMount",value:function(){this.initData()}},{key:"initData",value:function(){var e=this,t=this.props.dispatch,a=this.state.id,n=function(t){t.success&&e.setState({examList:t.data}),e.setState({spinLoading:!1})};this.setState({spinLoading:!0}),t&&t({type:"report/detail",payload:{examId:a},callback:n})}},{key:"formatType",value:function(e){var t="";switch(e){case 1:t="\u591a\u9009\u9898";break;case 2:t="\u5355\u9009\u9898";break;default:t="\u5224\u65ad\u9898";break}return t}},{key:"render",value:function(){var e=this,t=this.state,a=t.examList,n=t.spinLoading;return v.default.createElement(r.default,null,a.map(function(t,a){return v.default.createElement("div",{key:t.question_id,className:"examlist"},v.default.createElement("div",{className:t.score>0?"right":""},"\u7b2c",a+1,"\u9898: ",t.topic,",",t.questions,"(",e.formatType(t.is_multiple_selection),") [\u8003\u751f\u5f97\u5206: ",t.score,"]"),v.default.createElement("ul",null,t.result.map(function(e,t){return v.default.createElement("li",{className:"1"===e.isCorrect?"correct":"",key:e.optionId},t+1,": ",e.optionDetail,"1"===e.isCorrect?" (\u6b63\u786e\u7b54\u6848)":null)})))}),v.default.createElement("div",{className:"foot-btn"},v.default.createElement(l.default,{onClick:function(){return history.back()}},"\u8fd4\u56de")),v.default.createElement("div",{className:n?"spin":"spin-none"},v.default.createElement(s.default,{size:"large"})))}}]),t}(v.Component),b=(0,h.connect)(function(e){var t=e.userInfo,a=e.loading;return{data:t.data,loading:a.models.userInfo}})(y);t.default=b}}]);