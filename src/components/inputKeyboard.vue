<template>
    <div v-if="keyboardPopup" class="keyboard fr">
        <div class="left num-area fc">
            <div 
                v-for="(nums, index) in numbers" 
                :key="index" 
                class="line fr"
            >
                <div 
                    v-for="(num, index) in nums" 
                    :key="index"
                    class="number"
                    @click="setAmtInput(num)"
                >
                    {{num}}
                </div>
            </div>
            <div class="line fr">
                <div class="number zero" @click="setAmtInput(0)">0</div>
                <div class="number dot" @click="setAmtInput('.')">.</div>
            </div>
        </div>
        <div class="right op-area fc">
            <div class="operator delete" @click="deleteAmtInput()">×</div>
            <div class="operator confirm" @click="confirmAmtInput()">确认</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            keyboardPopup: false, // 是否弹出虚拟自定义键盘
            numbers: [[1,2,3],[4,5,6],[7,8,9]]
        }
    },
    methods: {
        setAmtInput(val) {
            this.$emit("amtInput", val)
        },
        deleteAmtInput() {
            this.$emit("amtDelete")
        },
        toggleKeyboard() {
            this.keyboardPopup = !this.keyboardPopup
        }
    }
}
</script>

<style lang="scss">
.fr {
    display: flex;
}
.fc {
    display: flex;
    flex-direction: column;
}
@mixin setTextCenter($lineHeight) {
    text-align: center;
    line-height: $lineHeight;
}
.keyboard {
    --single-height: 30px;
    width: 90%;
    height: calc(var(--single-height) * 4);
    .left {
        flex: 2;
        .number {
            flex: 1;
            // height: var(--single-height);
            // line-height: var(--height);
            // text-align: center;
            @include setTextCenter(var(--single-height));
        }
        .zero {
            flex: 2;
        }
    }
    .right {
        flex: 1;
        .operator {
            width: 100%;
        }
        .delete {
            flex: 1;
            @include setTextCenter(var(--single-height));
        }
        .confirm {
            flex: 3;
            @include setTextCenter(calc(var(--single-height) * 3));
            color: #fff;
            background-color: rgb(243, 157, 60);
        }
    }
}
</style>