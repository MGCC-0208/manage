<template>
  <div>
    <div class="container">
      <el-row>
        <el-col :xl="18" :lg="18" style="border-right: 1px solid #dcdfe6; margin: auto;">
          <div style="padding-left: 10px">
            <div class="handle-box">
              <el-input v-model="query.username" placeholder="用户名" class="handle-input mr10" clearable></el-input>
              <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
              <el-button type="primary" :icon="Plus" @click="addVisible = true;Object.assign(form, new User())"
                         v-action:user:create>新增
              </el-button>
              <el-button :disabled="multipleChoice" type="primary" :icon="Delete" @click="batchDelete(multipleSelection)">批量删除</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" />
              <el-table-column align="center" prop="name" label="用户名"></el-table-column>
              <el-table-column align="center" prop="gender" label="性别">
                <template #default="{ row }">
                  <span>{{ row.gender === 'MALE' ? '男' : '女' }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="age" label="年龄"></el-table-column>
              <el-table-column align="center" prop="phone" label="手机号"></el-table-column>
              <el-table-column align="center" prop="address" label="居住地址"></el-table-column>
              <el-table-column align="center" label="操作" width="200" fixed="right">
                <template #default="scope">
                  <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-action:user:update>
                    编辑
                  </el-button>
                  <el-button text :icon="Delete" class="red" @click="handleDelete(scope.row)" v-action:user:delete>
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                  background
                  layout="total, prev, pager, next"
                  :current-page="query.pageIndex"
                  :page-size="query.pageSize"
                  :total="pageTotal"
                  @current-change="handlePageChange"
              ></el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 新增用户弹出框 -->
    <el-dialog title="新增" v-model="addVisible" width="30%">
      <el-form :inline="true" :label-position="'top'">
        <el-form-item label="用户名">
          <el-input width="300px" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio label="MALE">男</el-radio>
            <el-radio label="FEMALE">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item  label="居住地址">
          <el-cascader  v-model="form.cities" @change="addressChange" :options="regionData" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.detailedAddress"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="addVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveAdd">确 定</el-button>
				</span>
      </template>
    </el-dialog>
    <!-- 编辑用户弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form :inline="true" :label-position="'top'">
        <el-form-item label="用户名">
          <el-input width="300px" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio label="MALE">男</el-radio>
            <el-radio label="FEMALE">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item  label="居住地址">
          <el-cascader  v-model="form.cities" @change="addressChange" :options="regionData" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.detailedAddress"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {getCurrentInstance, reactive, ref, toRefs} from 'vue';
import {ElMessage, ElMessageBox, ElTable} from 'element-plus';
import {Delete, Edit, Lock, Plus, Search, Unlock} from '@element-plus/icons-vue';
import {createUser, deleteUser, disableUser, enableUser, getUserList, updateUser} from "../api/user";
import request from "../../utils/request.js"
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'


interface TableItem {
  id: number;
  name: string;
  gender: string;
  age: number;
  phone: string;
  cities: any[];
  detailedAddress: string;
  address: string;
}

const query = reactive({
  username: '',
  pageIndex: 1,
  pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getUserData = () => {
  request.get("/user/users", {
    page: query.pageIndex,
    size: query.pageSize,
    username: query.username
  }).then(res => {
    tableData.value = res.data.content;
    pageTotal.value = res.data.totalElements;
  })
};
getUserData();

// 查询操作
const handleSearch = () => {
  query.pageIndex = 1;
  getUserData();
};
// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  getUserData();
};

// 删除操作
const handleDelete = async (row: any) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  }).then(() => {
    request.get("/user/delete", {id: row.id }).then(res => {
      getUserData();
    });
    ElMessage.success('删除成功');
  })
      .catch(() => {
        ElMessage.error('删除失败');
      });
};

//表格新增时
const addVisible = ref(false);

// 表格编辑时弹窗和保存
const editVisible = ref(false);

const multipleChoice = ref(false);

class User {
  name = '';
  phone = '';
  gender = 'MALE';
  age = undefined;
  cities: string;
  detailedAddress: string;
  address: string;
}

let itemId: number = 0;
let form = reactive(new User());
const saveAdd = async () => {
  await request.post("user/add",{
    name: form.name,
    age: form.age,
    gender: form.gender,
    phone: form.phone,
    cities: JSON.stringify(form.cities),
    detailedAddress: form.detailedAddress,
    address: form.address + form.detailedAddress
  }).then(res => {
    getUserData();
    ElMessage.success(`新增成功`);
    addVisible.value = false;
  });
};

const addressChange =  (arr) => {
  form.address = CodeToText[arr[0]] +CodeToText[arr[1]] +CodeToText[arr[2]];
}
const handleEdit = (index: number, row: any) => {
  itemId = row.id;
  form.name = row.name;
  form.phone = row.phone;
  form.gender = row.gender;
  form.age = row.age;
  form.detailedAddress = row.detailedAddress;
  form.cities = JSON.parse(row.cities);
  editVisible.value = true;
};
const saveEdit = async () => {
  editVisible.value = false;
  await request.post("user/save",{
    id: itemId,
    name: form.name,
    age: form.age,
    gender: form.gender,
    phone: form.phone,
    cities: JSON.stringify(form.cities),
    detailedAddress: form.detailedAddress,
    address: form.address + form.detailedAddress
  }).then(res => {
    getUserData();
    ElMessage.success(`修改成功`);
    addVisible.value = false;
  });
};

let batchIds = [];
const multipleSelection = ref<User[]>([])
const batchDelete = async (rows?: User[]) => {
  if (rows) {
    rows.forEach((row) => {
      batchIds.push(row.id);
    })
    await ElMessageBox.confirm('确定要删除吗？', '提示', {
      type: 'warning'
    }).then(() => {
      request.get("/user/batchDelete", {ids: JSON.stringify(batchIds).replace(/]|[[]/g, '') }).then(res => {
        getUserData();
        ElMessage.success('删除成功');
        batchIds = [];
      }).catch(() => {
        ElMessage.error('删除失败');
      });

    })
        .catch(() => {
          
        });
  }
}
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #F56C6C;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
