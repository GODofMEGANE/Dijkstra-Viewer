'use strict';
var mode = 1;
var arr = [[0,Infinity],[Infinity,0]];
var nodenum = 1;
var nodes = new Array(0);
var interval_id;
var select_node = -1;
var simulate = new Array(0);
var starting = false;

var lines = new Array(0);
var templines = new Array(0);
var savelines = new Array(0);
var sim_comp = new Array(0);

window.onload = function setup(){
    var element = document.createElement('img');
    element.src = 'images/start.png';
    element.width = 50;
    element.height = 50;
    element.id = "0";
    element.style.position = "absolute";
    element.style.top = "100px";
    element.style.left = "15px";
    element.ondragend = function(event){
        if(mode == 1){
            var x = event.clientX;
            var y = event.clientY;
            var width = this.offsetWidth;
            var height = this.offsetHeight;
            this.style.top = (y-height/2) + "px";
            this.style.left = (x-width/2) + "px";
            drawline();
        }
    }
    element.onclick = function(){
        if(mode == 2){
            if(select_node == -1)select_node = parseInt(this.id);
            else if(select_node != parseInt(this.id)){
                if(arr[select_node][parseInt(this.id)] == Infinity){
                    var weight = parseFloat(prompt('辺の長さを入力','例:1.0'));
                    arr[select_node][parseInt(this.id)] = weight;
                    arr[parseInt(this.id)][select_node] = weight;
                    select_node = -1;
                }
                else{
                    arr[select_node][parseInt(this.id)] = Infinity;
                    arr[parseInt(this.id)][select_node] = Infinity;
                    select_node = -1;
                }
                drawline();
            }
        }
    }
    nodes.push(document.getElementById("main").appendChild(element));

    element = document.createElement('img');
    element.src = 'images/goal.png';
    element.width = 50;
    element.height = 50;
    element.id = "1";
    element.style.position = "absolute";
    element.style.top = "100px";
    element.style.left = "75px";
    element.ondragend = function(event){
        if(mode == 1){
            var x = event.clientX;
            var y = event.clientY;
            var width = this.offsetWidth;
            var height = this.offsetHeight;
            this.style.top = (y-height/2) + "px";
            this.style.left = (x-width/2) + "px";
            drawline();
        }
    }
    element.onclick = function(){
        if(mode == 2){
            if(select_node == -1)select_node = parseInt(this.id);
            else if(select_node != parseInt(this.id)){
                if(arr[select_node][parseInt(this.id)] == Infinity){
                    var weight = parseFloat(prompt('辺の長さを入力','例:1.0'));
                    arr[select_node][parseInt(this.id)] = weight;
                    arr[parseInt(this.id)][select_node] = weight;
                    select_node = -1;
                }
                else{
                    arr[select_node][parseInt(this.id)] = Infinity;
                    arr[parseInt(this.id)][select_node] = Infinity;
                    select_node = -1;
                }
                drawline();
            }
        }
    }
    nodes.push(document.getElementById("main").appendChild(element));

    setInterval(loop, 50);
    setInterval(tick, 3000);
}

//50ms
function loop(){
}

//3000ms
function tick(){
    for(;templines.length!=0;templines.pop().remove()){}
    if(starting == true){
        if(simulate.length == 0){
            starting = false;
        }
        else{
            var next = simulate.shift()
            switch(next[0]){
                case "Search":
                    document.getElementById('text').innerText = "探索していない頂点の内一番近いこの頂点から探索を行います";
                    for(;savelines.length!=0;savelines.pop().remove()){}
                    for(var i = 0;i < nodes.length;i++){
                        if(sim_comp[i] == false)nodes[i].style.border = '0px solid #ff0000'
                        else nodes[i].style.border = '3px solid #ffffff'
                    }
                    nodes[next[1]].style.border = '3px solid #ff0000'
                    savelines.push(new LeaderLine(
                        nodes[0],
                        nodes[next[1]],
                        {
                            middleLabel: LeaderLine.pathLabel(next[2].toString()),
                            startPlug: 'square',
                            endPlug: 'arrow1',
                            path: 'fluid',
                            color: 'royalblue'
                        }
                    ));
                    sim_comp[next[1]] = true;
                    break;
                case "Ignore":
                    document.getElementById('text').innerText = "この頂点へ行けますがもっと短い経路が見つかっているため無視します";
                    templines.push(new LeaderLine(
                        nodes[0],
                        nodes[next[1]],
                        {
                            middleLabel: LeaderLine.pathLabel(next[2].toString()),
                            startPlug: 'square',
                            endPlug: 'arrow1',
                            path: 'fluid',
                            color: 'forestgreen'
                        }
                    ));
                    break;
                case "Push":
                    document.getElementById('text').innerText = "この頂点へは距離"+next[2]+"で行くことができます";
                    templines.push(new LeaderLine(
                        nodes[0],
                        nodes[next[1]],
                        {
                            middleLabel: LeaderLine.pathLabel(next[2].toString()),
                            startPlug: 'square',
                            endPlug: 'arrow1',
                            path: 'fluid',
                            color: 'forestgreen'
                        }
                    ));
                    break;
                case "End":
                    if(next[1] == -1){
                        document.getElementById('text').innerText = "ゴールへはたどり着けませんでした";
                        lines.push(new LeaderLine(
                            nodes[0],
                            nodes[1],
                            {
                                middleLabel: LeaderLine.pathLabel("???"),
                                startPlug: 'square',
                                endPlug: 'arrow1',
                                path: 'fluid',
                                color: 'orange'
                            }
                        ));
                    }
                    else{
                        document.getElementById('text').innerText = "よってゴールへは距離"+next[1]+"で行くことができます";
                        for(;savelines.length!=0;savelines.pop().remove()){}
                        for(var i = 0;i < nodes.length;i++){
                            nodes[i].style.border = '0px solid #ff0000'
                        }
                        lines.push(new LeaderLine(
                            nodes[0],
                            nodes[1],
                            {
                                middleLabel: LeaderLine.pathLabel(next[1].toString()),
                                startPlug: 'square',
                                endPlug: 'arrow1',
                                path: 'fluid',
                                color: 'orange'
                            }
                        ));
                    }
                    break;
            }
        }
    }
}

function drawline(){
    for(;lines.length!=0;lines.pop().remove()){}
    for(var i = 0;i < nodenum;i++){
        for(var j = i+1;j < nodenum+1;j++){
            if(arr[i][j] != Infinity){
                lines.push(new LeaderLine(
                    nodes[i],
                    nodes[j],
                    {
                        middleLabel: LeaderLine.pathLabel(arr[i][j].toString()),
                        startPlug: 'square',
                        endPlug: 'square',
                        path: 'straight'
                    }
                ));
            }
        }
    }
}

function modechange(id){
    mode = id;
    switch(id){
        case 0:
            document.getElementById("modetext").innerText = "現在のモード:選択";
            select_node = -1;
            break;
        case 1:
            document.getElementById("modetext").innerText = "現在のモード:移動";
            select_node = -1;
            break;
        case 2:
            document.getElementById("modetext").innerText = "現在のモード:辺の追加削除";
            break;
    }
}

function addnode(){
    nodenum++;
    var newarr = new Array(nodenum+1);
    for(var i = 0;i < nodenum+1;i++){
        newarr[i] = new Array(nodenum+1);
        for(var j = 0;j < nodenum+1;j++){
            newarr[i][j] = Infinity;
            if(i == j)newarr[i][j] = 0;
        }
    }
    for(var i = 0;i < nodenum;i++){
        for(var j = 0;j < nodenum;j++){
            newarr[i][j] = arr[i][j];
        }
    }
    arr = newarr;
    var element = document.createElement('img');
    element.src = 'images/node.png';
    element.width = 50;
    element.height = 50;
    element.id = nodenum.toString();
    element.style.position = "absolute";
    element.ondragend = function(event){
        if(mode == 1){
            var x = event.clientX;
            var y = event.clientY;
            var width = this.offsetWidth;
            var height = this.offsetHeight;
            this.style.top = (y-height/2) + "px";
            this.style.left = (x-width/2) + "px";
            drawline();
        }
    }
    element.onclick = function(){
        if(mode == 2){
            if(select_node == -1)select_node = parseInt(this.id);
            else if(select_node != parseInt(this.id)){
                if(arr[select_node][parseInt(this.id)] == Infinity){
                    var weight = parseFloat(prompt('辺の長さを入力','例:1.0'));
                    arr[select_node][parseInt(this.id)] = weight;
                    arr[parseInt(this.id)][select_node] = weight;
                    select_node = -1;
                }
                else{
                    arr[select_node][parseInt(this.id)] = Infinity;
                    arr[parseInt(this.id)][select_node] = Infinity;
                    select_node = -1;
                }
                drawline();
            }
        }
    }

    nodes.push(document.getElementById("main").appendChild(element));
    drawline();
    console.log(arr);
}

function deletenode(){
    if(nodenum > 1){
        nodenum = Math.max(1, nodenum-1);
        var newarr = new Array(nodenum+1);
        for(var i = 0;i < nodenum+1;i++){
            newarr[i] = new Array(nodenum+1);
            for(var j = 0;j < nodenum+1;j++){
                newarr[i][j] = arr[i][j];
            }
        }
        arr = newarr;
    
        nodes.pop().remove();
        drawline();
        console.log(arr);
    }
}

function start(){
    console.log(arr);

    var N = nodenum+1;
    var question = arr;
    var completed = new Array(N);
    for(var i = 0;i < N;i++){
        completed[i] = false;
    }
    var answer = new Array(N);
    for(var i = 0;i < N;i++){
        answer[i] = Infinity;
    }
    answer[0] = 0;
    var queue = [0];
    //Start:0 Goal:1
    while(queue.length != 0){
        var min_node = -1;
        var min_dist = Infinity;
        console.log(queue);
        for(var i = 0;i < queue.length;i++){
            if(answer[queue[i]] < min_dist){
                min_node = i;
                min_dist = answer[queue[i]];
            }
        }
        var now = queue[min_node];
        simulate.push(["Search", now, min_dist]);
        console.log("Search:"+now+" Dist:"+answer[now]);
        queue.splice(min_node,1);
        for(var i = 0;i < N;i++){
            if(now != i && question[now][i] != Infinity && completed[i] == false && answer[i] >= answer[now]+question[now][i]){
                if(i!=1)simulate.push(["Push", i, answer[now]+question[now][i]]);
                console.log("Push => "+i);
                queue.push(i);
                answer[i] = answer[now]+question[now][i];
            }
            else if(now != i && question[now][i] != Infinity && completed[i] == false){
                simulate.push(["Ignore", i, answer[now]+question[now][i]]);
            }
        }
        completed[now] = true;
        queue = Array.from(new Set(queue));
    }
    if(completed[1] == false){
        simulate.push(["End", -1]);
        console.log("ゴールにたどり着けませんでした");
    }
    else{
        simulate.push(["End", answer[1]]);
        console.log("距離は" + answer[1]);
    }
    for(var i = 0;i < N;i++)sim_comp.push(false);
    starting = true;
}