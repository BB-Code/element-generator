const formGenerator = (obj) => {
    let result = '';
    obj.forEach(element => {
        switch (element.name) {
            case 'select':
                result += `<el-form-item label="${element.label}" prop="${element.prop}">
                <el-select v-model="dialogProps.rowData!.${element.model}" clearable></el-select>
            </el-form-item>`
                break;
            case 'input':
                result += `<el-form-item label="${element.label}" prop="${element.prop}">
                <el-input v-model="dialogProps.rowData!.${element.model}" clearable></el-input>
            </el-form-item>`
                break;
            case 'radio':
                result += `<el-form-item label="${element.label}" prop="${element.prop}">
                <el-radio-group v-model="dialogProps.rowData!.${element.model}">
                    ${radioGenerator(element.radioList)
                    }
                </el-radio-group>
            </el-form-item>`
                break;
            case 'date':
                result += `<el-form-item label="${element.label}" prop="${element.prop}">
                <el-date-picker v-model="dialogProps.rowData!.${element.model}" type="date" />
            </el-form-item>`
                break;
            case 'file':
                result += `<el-form-item label=${element.label}>
                        <el-button @click="AddFile">上传附件</el-button>
                 </el-form-item>`
                break;
            default:
                break;
        }
    });

    return result
}

const radioGenerator = (arr) => {
    let result = '';
    if(arr){
        arr.forEach((element, index) => {
            result += `<el-radio :label="${index}">${element}</el-radio>`
        });
    }
    return result
}

const ruleGenerator = (obj) => {
    let result = '';
    obj.forEach(element => {
        if (element.name != 'file') {
            result += `${element.prop}: [{ required: true, message: "请${element.name == 'select' ? '选择' : element.name == 'input' ? '输入' : ''}${element.label}", trigger: "blur" }],`
        }
    });
    return result
}

const DialogGenerator = ({
    name,
    width,
    type, // 1 表单 2 标签导航
    itemArray, // [{name:'',label:'',prop:'',model:'',radioList:''}]
    isUploadFile // 是否需要上传附件
}) => {
    let template = `<template>
	<div>
		<el-dialog v-model="dialogVisible" :title="\`\$\{dialogProps.title\}\`" width="${width}px" draggable>
			<div class="view">
				${type == 1 ? `<el-form ref="${name}FormRef" label-width="100px" label-suffix=" :" :rules="rules" :model="dialogProps!.rowData">
                ${formGenerator(itemArray)
            }
            </el-form>`: ``}
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="dialogVisible = false">确认</el-button>
				</span>
			</template>
		</el-dialog>
        ${isUploadFile && `<UploadFile ref="uplodaRef" />`}
	</div>
</template>
<script setup lang="ts" name="${name}Dialog">
import { ref, reactive } from "vue";
import { ElDialog } from "element-plus";
${isUploadFile && `import UploadFile from "@/components/uploadFile/UploadFile.vue";`}

const dialogVisible = ref(false);
const rules = reactive({
    ${ruleGenerator(itemArray)}
});
${isUploadFile && `const uplodaRef = ref();`}
interface dialogProps {
	title: string;
	rowData?: any;
}
const dialogProps = ref<dialogProps>({
	title: ""
});

// 附件上传
const AddFile = () => {
	uplodaRef.value.uploadParams({
		id: "",
		name: "",
		title: "",
		uploadApi: "",
		getTableList: ""
	});
};

// 接收父组件传过来的参数
const acceptParams = (params: dialogProps): void => {
	dialogProps.value = params;
	dialogVisible.value = true;
};
defineExpose({
	acceptParams
});
</script>
<style scoped lang="scss"></style>
`
    return template
}