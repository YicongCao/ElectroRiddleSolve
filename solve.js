// 代表九宫格里的一个格子
class Tile {
    constructor(t1, t2) {
        this.t1 = t1;
        this.t2 = t2;
    }
}

// 代表九宫格的初始排布
var riddle = [
    new Tile(0, 1), new Tile(1, 3), new Tile(2, 3),
    new Tile(0, 2), new Tile(0, 2), new Tile(0, 3),
    new Tile(0, 1), new Tile(0, 3), new Tile(0, 2)
]

// 分别旋转A、B、C、D手柄
var rotateHandle90 = (riddle, indexs) => {
    // 备份自己、旋转下个、移动备份并旋转
    var moveTile = (i, j) => {
        if (j > 3) {
            return
        }
        var temp1 = riddle[indexs[i]].t1
        var temp2 = riddle[indexs[i]].t2
        // 递龟（喏
        moveTile((i + 1) % 4, j + 1)
        riddle[indexs[(i + 1) % 4]].t1 = (temp1 + 1) % 4
        riddle[indexs[(i + 1) % 4]].t2 = (temp2 + 1) % 4
    }
    moveTile(0, 0)
}
var rotateHandleA = (riddle) => rotateHandle90(riddle, [0, 1, 4, 3])
var rotateHandleB = (riddle) => rotateHandle90(riddle, [1, 2, 5, 4])
var rotateHandleC = (riddle) => rotateHandle90(riddle, [3, 4, 7, 6])
var rotateHandleD = (riddle) => rotateHandle90(riddle, [4, 5, 8, 7])
var handles = ['A', 'B', 'C', 'D']
var rotates = [rotateHandleA, rotateHandleB, rotateHandleC, rotateHandleD]

// 检查连通性
var checkConnection = (riddle) => {
    // 四向速查表 [当前点索引][目标点索引,目标点方向]
    var arrowTable = [
        [[null, null], [1, 3], [3, 0], [null, null]], [[null, null], [2, 3], [4, 0], [0, 1]], [[null, null], [null, null], [5, 0], [1, 1]],
        [[0, 2], [4, 3], [6, 0], [null, null]], [[1, 2], [5, 3], [7, 0], [3, 1]], [[2, 2], [null, null], [8, 0], [4, 1]],
        [[3, 2], [7, 3], [null, null], [null, null]], [[4, 2], [8, 3], [null, null], [6, 1]], [[5, 2], [null, null], [null, null], [7, 1]]
    ]
    var checkNext = (i, t) => {
        // 连接到了区域外
        if (i == null || t == null) {
            return false
        }
        // 第一个砖块必须有一个结点在触点上
        if (i == 0 && riddle[i].t1 != 0 && riddle[i].t2 != 0) {
            return false
        }
        // 第九个砖块必须有一个结点连接上一个砖块、另一个结点在触点上
        if (i == 8) {
            return (riddle[i].t1 == 2 || riddle[i].t2 == 2) &&
                (riddle[i].t1 == t || riddle[i].t2 == t)
        }
        // 指向下一个砖块
        if (riddle[i].t1 == t) {
            // console.log(i) // 打印连接路径
            var it = arrowTable[i][riddle[i].t2]
            return checkNext(it[0], it[1])
        } else if (riddle[i].t2 == t) {
            // console.log(i) // 打印连接路径
            var it = arrowTable[i][riddle[i].t1]
            return checkNext(it[0], it[1])
        } else {
            return false
        }
    }
    return checkNext(0, 0)
}

// 执行搜索
var solveRiddle = (riddle, rotates) => {
    const searchDepthMax = 6 // 搜索深度为6
    var solutions = []
    var replica = {}
    var resetReplica = () => {
        replica = JSON.parse(JSON.stringify(riddle))
    }
    resetReplica()
    var performOperations = (replica, operations) => {
        for (var j = 0; j < operations.length; j++) {
            rotates[operations[j]](replica)
        }
        return replica
    }
    var searchDeeper = (path, depth, maxDepth) => {
        if (depth > maxDepth) {
            return
        }
        resetReplica()
        if (checkConnection(performOperations(replica, path))) {
            solutions.push(path.concat()) // 复制到正解队列
            console.log("found", path)
            return
        }
        // 深度优先搜索
        for (var i = 0; i < 4; i++) {
            path.push(i)
            searchDeeper(path, depth + 1, maxDepth)
            path.pop(i)
        }
    }
    searchDeeper([], 0, searchDepthMax)
    return solutions
}

// 打印路径
var printSolution = (solution) => {
    var solutionHandles = ""
    for (var i = 0; i < solution.length; i++) {
        solutionHandles += (handles[solution[i]])
    }
    console.log("-", solutionHandles)
}

// 开干
console.log("\nstart searching:")
var solutions = solveRiddle(riddle, rotates)
console.log("\nfinal solutions:")
for (var i = 0; i < solutions.length; i++) {
    printSolution(solutions[i])
}