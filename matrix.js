"use strict"

// An MxN matrix of rationals.
function Matrix(rows, cols, mat) {
    this.rows = rows
    this.cols = cols
    if (mat) {
        this.mat = mat
    } else {
        this.mat = []
        for (var i = 0; i < rows * cols; i++) {
            this.mat.push(zero)
        }
    }
}
Matrix.prototype = {
    constructor: Matrix,
    copy: function() {
        var mat = this.mat.slice()
        return new Matrix(this.rows, this.cols, mat)
    },
    index: function(row, col) {
        return this.mat[row*this.cols + col]
    },
    setIndex: function(row, col, value) {
        this.mat[row*this.cols + col] = value
    },
    addIndex: function(row, col, value) {
        this.setIndex(row, col, this.index(row, col).add(value))
    },
    // Multiplies all positive elements of a column by the value, in-place.
    // (For prod modules.)
    mulPosColumn: function(col, value) {
        for (var i = 0; i < this.rows; i++) {
            var x = this.index(i, col)
            if (x.less(zero) || x.equal(zero)) {
                continue
            }
            this.setIndex(i, col, x.mul(value))
        }
    },
    appendColumn: function(column) {
        var mat = []
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                mat.push(this.index(i, j))
            }
            mat.push(column[i])
        }
        return new Matrix(this.rows, this.cols + 1, mat)
    },
    // Sets a column to all zeros.
    zeroColumn: function(col) {
        for (var i = 0; i < this.rows; i++) {
            this.setIndex(i, col, zero)
        }
    },
    swapRows: function(a, b) {
        for (var i = 0; i < this.cols; i++) {
            var temp = this.index(a, i)
            this.setIndex(a, i, this.index(b, i))
            this.setIndex(b, i, temp)
        }
    },
    // Places the matrix into reduced row echelon form, in-place, and returns
    // the column numbers of the pivots.
    rref: function() {
        var rows = this.rows
        var cols = this.cols
        var piv_row = 0
        var piv_col = 0
        var pivots = []
        while (piv_col < cols && piv_row < rows) {
            var pivot_val
            var pivot_offset = 0
            for (; pivot_offset < rows - piv_row; pivot_offset++) {
                pivot_val = this.index(piv_row + pivot_offset, piv_col)
                if (!pivot_val.isZero()) {
                    break
                }
            }
            if (pivot_offset == rows - piv_row) {
                piv_col++
                continue
            }
            pivots.push(piv_col)
            if (pivot_offset != 0) {
                this.swapRows(piv_row, piv_row + pivot_offset)
            }
            for (var row = 0; row < rows; row++) {
                if (row == piv_row) {
                    continue
                }
                var val = this.index(row, piv_col)
                if (val.isZero()) {
                    continue
                }
                for (var i = 0; i < cols; i++) {
                    var newVal = pivot_val.mul(this.index(row, i)).sub(val.mul(this.index(piv_row, i)))
                    this.setIndex(row, i, newVal)
                }
            }
            piv_row += 1
        }
        for (var i = 0; i < pivots.length; i++) {
            var j = pivots[i]
            var pivot_val = this.index(i, j)
            this.setIndex(i, j, one)
            for (var col = j+1; col < cols; col++) {
                this.setIndex(i, col, this.index(i, col).div(pivot_val))
            }
        }
        return pivots
    }
}