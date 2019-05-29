/**
 * Created by zhangzhe on 2019/5/22
 * Email:544785380@qq.com
 * @params
 * elem:input节点id
 * number:传入显示一个或2个日期控件, 传入1 or 2(暂未实现)
 * date:需要返回的日期类型,传入 yyyy-MM-dd or yyyy-MM or yyyy or HH:mm:ss or yyyy-MM-dd HH:mm:ss or 自定义格式(暂未实现)
 * type:返回的数据类型(暂未实现)
 **/
const { log } = console;

function DateContainer(elem, number, date, type) {
    var ele = elem.elem || elem;
    this.clickElem = document.querySelector(ele);
    this.eleClick();
};
DateContainer.prototype = {
    init: function(paramDate) { //初始化日期控件
        var that = this;
        this.outerFrame = document.createElement('div'); //外部大框
        this.outerFrame.id = 'outer_frame';
        this.outerFrame.onselectstart = function() { return false }; //禁止选中变蓝
        this.outerFrame.onclick = function() { that.stopBubble() };
        this.dateShowOrDateBtn = document.createElement('div'); //上方日期按钮和显示
        this.dateShowOrDateBtn.className = 'dateShow_or_dateBtn';
        this.dateControlList = document.createElement('div'); //下方日期列表
        this.dateControlList.className = 'dateControl_list';
        this.dateControlListWeek = document.createElement('div'); //列表上部的星期
        this.dateControlListWeek.className = 'dateControl_list_week'
        this.dateControlListDays = document.createElement('div'); //列表下部的日期
        this.dateControlListDays.className = 'dateControl_list_days';
        this.dateBtnLastYear = document.createElement('div'); //上一年按钮
        this.dateBtnLastYear.className = 'dateBtn_lastYear';
        this.dateBtnLastYear.innerHTML = '<span>《</span>';
        this.dateBtnLastMonth = document.createElement('div'); //上一月按钮
        this.dateBtnLastMonth.className = 'dateBtn_lastMonth';
        this.dateBtnLastMonth.innerHTML = '<span><</span>';
        this.dateShow = document.createElement('div'); //显示日期
        this.dateShow.className = 'date_show';
        this.dateBtnNextMonth = document.createElement('div'); //下一月按钮
        this.dateBtnNextMonth.className = 'dateBtn_nextMonth';
        this.dateBtnNextMonth.innerHTML = '<span>></span>';
        this.dateBtnNextYear = document.createElement('div'); //下一年按钮
        this.dateBtnNextYear.className = 'dateBtn_nextYear';
        this.dateBtnNextYear.innerHTML = '<span>》</span>';
        this.dateShowOrDateBtn.appendChild(this.dateBtnLastYear);
        this.dateShowOrDateBtn.appendChild(this.dateBtnLastMonth);
        this.dateShowOrDateBtn.appendChild(this.dateShow);
        this.dateShowOrDateBtn.appendChild(this.dateBtnNextMonth);
        this.dateShowOrDateBtn.appendChild(this.dateBtnNextYear);
        this.outerFrame.appendChild(this.dateShowOrDateBtn);
        this.outerFrame.appendChild(this.dateControlList);
        this.dateControlList.appendChild(this.dateControlListWeek);
        this.dateControlList.appendChild(this.dateControlListDays);
        this.clickElem.parentNode.appendChild(this.outerFrame);
        this.drawDateControlList(paramDate);
        this.drawShowOrBtn(paramDate);
    },
    drawShowOrBtn: function(paramDate) { //绘制上方日期显示和点击按钮
        var m = paramDate || new Date();
        var date = new Date(m);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var date = date.getDate();
        var that = this;
        this.dateBtnLastYear.onclick = function() {
            that.stopBubble();
            that.delteListEle();
            year--;
            that.drawDateControlList(year + ',' + month);
        };
        this.dateBtnLastMonth.onclick = function() {
            that.stopBubble();
            that.delteListEle();
            month--;
            if (month === 0) {
                year--;
                month = 12;
            };
            that.drawDateControlList(year + ',' + month);
        };
        this.dateBtnNextMonth.onclick = function() {
            that.stopBubble();
            that.delteListEle();
            month++;
            if (month === 13) {
                year++;
                month = 1;
            };
            that.drawDateControlList(year + ',' + month);
        };
        this.dateBtnNextYear.onclick = function() {
            that.stopBubble();
            that.delteListEle();
            year++;
            that.drawDateControlList(year + ',' + month);
        };
    },
    drawDateControlList: function(paramDate) { //绘制日期列表
        var m = paramDate || new Date();
        var date = new Date(m);
        var nowYear = date.getFullYear();
        var nowMonth = date.getMonth() + 1;
        var nowDate = date.getDate();
        var arrWeek = ['日', '一', '二', '三', '四', '五', '六'];
        var liWeek = '';
        var firstDay = this.getFirstDayOfWeek(date);
        var lastDay = this.getLastDatOfWeek(date);
        var days = this.getDaysOfMonth(date);
        this.spanContainer = [];
        this.spanParent = this.dateControlListDays;
        for (var i = 0; i < arrWeek.length; i++) {
            liWeek += '<li>' + arrWeek[i] + '</li>';
        }
        this.dateControlListWeek.innerHTML = `<ul>` + liWeek + `</ul>`;

        for (var i = 0; i < firstDay; i++) { //补全1号之前的空缺
            var tempDate = new Date(date);
            tempDate.setDate(i - firstDay + 1);
            var span = document.createElement("span");
            span.className = 'uglify';
            this.spanContainer.push({ span: span, date: tempDate });
        }
        date.setDate(1); //设置日期为1号，否则下面的第一个日期是当日日期
        for (var i = 1; i <= days; i++) { //当月天数
            var span = document.createElement("span");
            span.className = 'beautify';
            this.spanContainer.push({ span: span, date: new Date(date) });
            date.setDate(i + 1);
        }

        for (var i = lastDay; i < 6; i++) { //补全最后一天后面的空缺
            var span = document.createElement("span");
            span.className = "uglify";
            this.spanContainer.push({ span: span, date: new Date(date) });
            date.setDate(date.getDate() + 1);
        }
        for (var i = 0; i < this.spanContainer.length; i++) {
            var spanList = this.spanContainer[i];
            var span = spanList.span;
            span.year = spanList.date.getFullYear();
            span.month = spanList.date.getMonth() + 1;
            span.date = spanList.date.getDate();
            span.innerText = spanList.date.getDate();
            if (span.month === nowMonth && span.date === nowDate) span.className += ' dateList_select'; //给默认当前日期加class
            var that = this;
            span.onclick = function() {
                that.stopBubble();
                var target = event.target;
                var spanCssbg = target.parentElement.getElementsByClassName("dateList_select");
                for (var i = 0; i < spanCssbg.length; i++) {
                    spanCssbg[i].className = spanCssbg[i].className.replace(" dateList_select", "");
                }
                target.className += " dateList_select";
                that.inputChangeDate(target.year, target.month, target.date);
                that.showDate(target.year, target.month);
                that.clickElem.parentNode.removeChild(that.outerFrame);
                that.clickFlag = false;
            }
            this.showDate(nowYear, nowMonth);
            this.dateControlListDays.appendChild(span);
        }
    },
    getDaysOfMonth: function(paramDate) { //计算一个月天数(传入参数最好是字符串类型 '2019,5')
        var m = paramDate || new Date();
        var date = new Date(m);
        var month = date.getMonth();
        var time = date.getTime();
        var newTime = date.setMonth(month + 1);
        return Math.ceil((newTime - time) / (24 * 60 * 60 * 1000));
    },
    getFirstDayOfWeek: function(paramDate) { //计算每个月1号是周几(传入参数最好是字符串类型 '2019,5',返回0是周日，其他一一对应，周一是1)
        var m = paramDate || new Date();
        var date = new Date(m);
        date.setDate(1);
        var firstDay = date.getDay();
        return firstDay;
    },
    getLastDatOfWeek: function(paramDate) { //计算每个月最后一天是周几(传入参数最好是字符串类型 '2019,5',返回0是周日，其他一一对应，周一是1)
        var m = paramDate || new Date();
        var days = this.getDaysOfMonth(m);
        var date = new Date(m);
        date.setDate(days);
        var lastDay = date.getDay();
        return lastDay;
    },
    inputChangeDate: function(year, month, date) { //填充到input中
        this.clickElem.value = year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
    },
    delteListEle: function() { //删除节点
        this.spanContainer = [];
        for (var i = this.spanParent.childNodes.length - 1; i >= 0; i--) { //i++方式删除不干净，因为删除的过程中length变小，影响了遍历
            this.spanParent.removeChild(this.spanParent.childNodes[i]);
        }
    },
    showDate: function(year, month) { //控件内部显示日期
        var showDate = year + '年' + month + '月';
        this.dateShow.innerHTML = '<span>' + showDate + '</span>'
    },
    eleClick: function(paramDate) { //inuput点击事件
        var that = this;
        this.clickFlag = false;
        this.clickElem.onmousedown = function() {
            that.stopBubble();
            var inpVal = that.clickElem.value.replace(/[\-\,\/]/g, ',');
            if (that.clickFlag === false) {
                that.init(inpVal);
                that.clickFlag = true;
                return;
            }
            if (that.clickFlag === true) {
                return;
            }
        };
        this.blurFunc();
        this.clickOtherAreaRemList();
    },
    blurFunc: function(paramDate) { //input中输入日期，进行格式化
        var that = this;
        this.clickElem.onblur = function() {
            var inpVal = that.clickElem.value;
            if (inpVal != '') {
                inpVal = inpVal.replace(/[^0-9]/ig, "");
                if (inpVal.length === 6) {
                    return;
                } else {
                    var inYear = parseInt(inpVal.slice(0, 4));
                    var inMonth = parseInt(inpVal.slice(4, 6));
                    var inDate = parseInt(inpVal.slice(6, 8));
                    if (inDate > 31) {
                        inMonth += Math.floor(inDate / 31);
                        if (inMonth > 12) {
                            inYear += Math.floor(inMonth % 12) === 0 ? (Math.floor(inMonth / 12) - 1) : Math.floor(inMonth / 12);
                            inMonth = inMonth % 12 === 0 ? 12 : inMonth % 12;
                        }
                        if (inMonth === 1 || inMonth === 5 || inMonth === 7 || inMonth === 8 || inMonth === 10 || inMonth === 12) {
                            inDate = inDate % 31 === 0 ? 1 : (inDate % 31 + 1);
                        }
                        if (inMonth === 4 || inMonth === 6 || inMonth === 9 || inMonth === 11) {
                            inDate = inDate % 31 === 0 ? 1 : inDate % 31;
                        }
                        if (inMonth === 2) {
                            inDate = inDate - 31;
                        }
                        if (inMonth === 3) {
                            var paramsDays = that.getDaysOfMonth(inYear + ',' + (inMonth - 1));
                            inDate = inDate - paramsDays;
                        }
                    } else if (inDate < 31) {
                        if (inMonth > 12) {
                            inYear += Math.floor(inMonth % 12) === 0 ? (Math.floor(inMonth / 12) - 1) : Math.floor(inMonth / 12);
                            inMonth = inMonth % 12 === 0 ? 12 : inMonth % 12;
                        }
                    }
                    that.delteListEle();
                    that.drawDateControlList(inYear + ',' + inMonth + ',' + inDate);
                    that.inputChangeDate(inYear, inMonth, inDate);
                    that.clickFlag = false;
                }
            } else {
                that.clickFlag = false;
            }
        }
    },
    stopBubble: function() { //阻止事件冒泡
        var e = window.event || event;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    },
    clickOtherAreaRemList: function() { //点其他区域删除日期组件
        var that = this;
        document.addEventListener('click', function() {
            if (that.clickFlag === false) {
                for (var i = 0; i < that.clickElem.parentNode.children.length; i++) {
                    if (that.clickElem.parentNode.children[i] === that.outerFrame) {
                        that.clickElem.parentNode.removeChild(that.outerFrame);
                        that.clickFlag = false;
                    }
                }
            } else {
                return;
            }
        });
    }
}