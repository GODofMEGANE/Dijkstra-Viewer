'use strict';
var mode = 1;
var arr = [[0,Infinity],[Infinity,0]];
var nodenum = 1;
var nodes = new Array(0);
var interval_id;
var select_node = -1;
var simulate = new Array(0);
var starting = false;

var costs = new Array(0);
var lines = new Array(0);
var templines = new Array(0);
var savelines = new Array(0);
var sim_comp = new Array(0);

window.onload = function setup(){
    var element = document.createElement('img');
    element.src = '../images/start.png';
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
                    var weight = parseFloat(prompt('Please enter a edge\'s length','Ex:1.0'));
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
    var ele_text = document.createElement('div');
    ele_text.width = 50;
    ele_text.height = 50;
    ele_text.innerText = "Start";
    ele_text.style.textAlign = "center";
    ele_text.style.position = "absolute";
    ele_text.style.top = (element.offsetTop-20) + 'px';
    ele_text.style.left = element.offsetLeft + 'px';
    costs.push(document.getElementById("main").appendChild(ele_text));

    element = document.createElement('img');
    element.src = '../images/goal.png';
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
                    var weight = parseFloat(prompt('Please enter a edge\'s length','Ex:1.0'));
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
    ele_text = document.createElement('div');
    ele_text.width = 50;
    ele_text.height = 50;
    ele_text.innerText = "Goal";
    ele_text.style.textAlign = "center";
    ele_text.style.position = "absolute";
    ele_text.style.top = (element.offsetTop-20) + 'px';
    ele_text.style.left = element.offsetLeft + 'px';
    costs.push(document.getElementById("main").appendChild(ele_text));

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
                    if(next[1] == 0){
                        for(var i = 0;i < nodenum+1;i++)sim_comp[i] = false;
                    }
                    document.getElementById('text').innerText = "Start searching from the nearest node that is not yet searched.";
                    for(;savelines.length!=0;savelines.pop().remove()){}
                    for(var i = 0;i < nodes.length;i++){
                        if(sim_comp[i] == false)nodes[i].style.border = '0px solid #ff0000'
                        else nodes[i].style.border = '3px solid #000000'
                    }
                    nodes[next[1]].style.border = '3px solid #ff0000'
                    if(next[1] != 0){
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
                    }
                    sim_comp[next[1]] = true;
                    break;
                case "Ignore":
                    document.getElementById('text').innerText = "It can\'t update the shortest distance to this node so ignore this result";
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
                    document.getElementById('text').innerText = "It takes "+next[2]+" distance unit to go to this node";
                    costs[next[1]].innerText = next[2];
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
                case "LoopContinue":
                    document.getElementById('text').innerText = "There were no updated node in current loop so repeat again";
                    break;
                case "LoopEnd":
                    document.getElementById('text').innerText = "There were no updated node in current loop so finish the algorithm";
                    break;
                case "DetourK":
                    document.getElementById('text').innerText = "It can be reached with shorter path if use detours";
                    templines.push(new LeaderLine(
                        nodes[next[1]],
                        nodes[next[3]],
                        {
                            middleLabel: LeaderLine.pathLabel(""),
                            startPlug: 'square',
                            endPlug: 'arrow1',
                            path: 'fluid',
                            color: 'forestgreen'
                        }
                    ));
                    templines.push(new LeaderLine(
                        nodes[next[3]],
                        nodes[next[2]],
                        {
                            middleLabel: LeaderLine.pathLabel(next[4].toString()),
                            startPlug: 'square',
                            endPlug: 'arrow1',
                            path: 'fluid',
                            color: 'forestgreen'
                        }
                    ));
                    break;
                case "End":
                    if(next[1] == -1){
                        document.getElementById('text').innerText = "We couldn\'t reach to goal";
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
                    else if(next[1] == -2){
                        document.getElementById('text').innerText = "Looped number of nodes times but nodes was updated so it has negative cycle";
                        lines.push(new LeaderLine(
                            nodes[0],
                            nodes[1],
                            {
                                middleLabel: LeaderLine.pathLabel("-Infinity"),
                                startPlug: 'square',
                                endPlug: 'arrow1',
                                path: 'fluid',
                                color: 'orange'
                            }
                        ));
                    }
                    else{
                        document.getElementById('text').innerText = "It takes " + next[1] + " distance unit to go to goal";
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
                    for(var i = 0;i < nodenum+1;i++){
                        costs[i].innerText = "";
                    }
                    costs[0].innerText = "Start";
                    costs[1].innerText = "Goal";
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
    for(var i = 0;i < nodenum+1;i++){
        costs[i].style.top = (nodes[i].offsetTop-20) + 'px';
        costs[i].style.left = nodes[i].offsetLeft + 'px';
    }
}

function modechange(id){
    mode = id;
    switch(id){
        case 0:
            document.getElementById("modetext").innerText = "Current mode:Select";
            select_node = -1;
            break;
        case 1:
            document.getElementById("modetext").innerText = "Current mode:Move nodes";
            select_node = -1;
            break;
        case 2:
            document.getElementById("modetext").innerText = "Current mode:Add/Remove nodes";
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
    element.src = '../images/node.png';
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
                    var weight = parseFloat(prompt('Please enter a edge\'s length','Ex:1.0'));
                    if(weight!=NaN){
                        arr[select_node][parseInt(this.id)] = weight;
                        arr[parseInt(this.id)][select_node] = weight;
                        select_node = -1;
                    }
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
    var ele_text = document.createElement('div');
    ele_text.width = 50;
    ele_text.height = 50;
    ele_text.innerText = "";
    ele_text.style.textAlign = "center";
    ele_text.style.position = "absolute";
    ele_text.style.top = (element.offsetTop-20) + 'px';
    ele_text.style.left = element.offsetLeft + 'px';
    costs.push(document.getElementById("main").appendChild(ele_text));
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
        costs.pop().remove();
        drawline();
        console.log(arr);
    }
}

function start(algorithm){
    console.log(arr);
    switch(algorithm){
        case 0:
            dijkstra();
            break;
        case 1:
            bellmanford();
            break;
        case 2:
            floydwarshall();
            break;
    }
    
}

function dijkstra(){
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
        if(now == 1)break;
        simulate.push(["Search", now, min_dist]);
        console.log("Search:"+now+" Dist:"+answer[now]);
        queue.splice(min_node,1);
        for(var i = 0;i < N;i++){
            if(now != i && question[now][i] != Infinity && completed[i] == false && answer[i] >= answer[now]+question[now][i]){
                simulate.push(["Push", i, answer[now]+question[now][i]]);
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
    if(answer[1] == Infinity){
        simulate.push(["End", -1]);
        console.log("We couldn\'t reach to goal");
    }
    else{
        simulate.push(["End", answer[1]]);
        console.log("Distance:" + answer[1]);
    }
    for(var i = 0;i < N;i++)sim_comp.push(false);
    starting = true;
}

function bellmanford(){
    var N = nodenum+1;
    var question = arr;
    var answer = new Array(N);
    for(var i = 0;i < N;i++){
        answer[i] = Infinity;
    }
    answer[0] = 0;
    var changed = false;
    for(var loop = 0;loop < N;loop++){
        changed = false;
        for(var node = 0;node < N;node++){
            if(answer[node]==Infinity)continue;
            simulate.push(["Search", node, answer[node]]);
            for(var edge = 0;edge < N;edge++){
                if(node!=edge && question[node][edge]!=Infinity && answer[node]+question[node][edge]<answer[edge]){
                    simulate.push(["Push", edge, answer[node]+question[node][edge]]);
                    console.log("Push => "+edge);
                    answer[edge] = answer[node]+question[node][edge];
                    changed = true;
                }
                else if(node!=edge && question[node][edge]!=Infinity){
                    simulate.push(["Ignore", edge, answer[node]+question[node][edge]]);
                }
            }
        }
        if(changed==false){
            simulate.push(["LoopEnd"]);
            break;
        }
        else{
            simulate.push(["LoopContinue"]);
        }
    }
    if(changed){
        simulate.push(["End", -2]);
        console.log("We couldn\'t reach to goal");
    }
    else if(answer[1] == Infinity){
        simulate.push(["End", -1]);
        console.log("We couldn\'t reach to goal");
    }
    else{
        simulate.push(["End", answer[1]]);
        console.log("Distance:" + answer[1]);
    }
    for(var i = 0;i < N;i++)sim_comp.push(false);
    starting = true;
}

function floydwarshall(){
    var N = nodenum+1;
    var question = arr;
    for (var k = 0; k < N; k++){
        for (var i = 0; i < N; i++) {
            for (var j = 0; j < N; j++) {
                if(question[i][j] > question[i][k] + question[k][j]){
                    simulate.push(["DetourK", i, j, k, question[i][k] + question[k][j]]);
                    console.log("DetourK => "+j);
                    question[i][j] = question[i][k] + question[k][j]
                }
            }
        }
    }
    if(question[0][1] == Infinity){
        simulate.push(["End", -1]);
        console.log("We couldn\'t reach to goal");
    }
    else{
        simulate.push(["End", question[0][1]]);
        console.log("Distance:" + question[0][1]);
    }
    for(var i = 0;i < N;i++)sim_comp.push(false);
    starting = true;
}