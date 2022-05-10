<center><h1>git</h1></center>

## 1. 初始化git

```shell
git init
```

## 2. 配置

### 个人信息配置

```shell
git config --local user.name ''
git config --local user.email ''
```

### 查看个人配置

```shell
git config --local --list
```

## 3. 查看工作区的文件状态

```shell
git status
```

## 4. 将工作区的项目添加到暂存区

```shell
git add .
```

将暂存区的文件撤回到工作区

```bash
git rm --cached [文件名]
```

## 5. 查看暂存区的文件状态

```shell
git ls-files
```

## 6. 将暂存区的文件添加到版本库

```shell
git commit -m '版本描述'
```

## 7. 查看版本库中的版本状态

```shell
git log
```

## 8. 回滚

查看版本

```bash
# 完整格式，只展示当前版本之前的版本
git log

# 一行显示，只展示当前版本之前的版本
git log --pretty=oneline

# 一行显示，哈希值部分省略，只展示当前版本之前的版本
git log --oneline
```



```bash
# 一行显示，哈希值部分省略，展示所有的版本
git reflog
```

### 8.1 前滚

```shell
git log
git log --pretty=oneline
git log --pretty=oneline
git reflog
```

```bash
git reset --hard 版本号
# 后退两步
git reset --hard HEAD^^
git reset --hard HEAD~2
```

### 8.2 后滚

```shell
git reflog
```

```shell
git reset –hard 版本号
```

### 8.3 `--hard` ,`--mixed` ,`--soft` 参数的对比

`--hard`

- 移动版本库指针
- 重置暂存区
- 重置工作区

`--mixed`

- 移动版本库指针
- 重置暂存区

`--soft`

- 移动版本库指针

## 9. 分支

### 9.1 查看当前分支

```shell
git branch # 查看当前分支
git branch -r # 查看远程分支
```

### 9.2 新建分支

```shell
git branch 分支名称
```

### 9.3 切换分支

```shell
git checkout 分支名称
```

## 10. 合并

### 10.1 命令

- 切换到被合并的分支

  ```bash
  git checkout [分支名]
  ```

- 执行`git merge [分支名]`

  ```bash
  git merge [分支名]
  ```

### 10.2 分支冲突

- master分支

  ```txt
  开发板1.0.0
  开发板1.0.1
  开发板1.2.2  master分支
  ```

- hot_fix分支

  ```txt
  开发板1.0.0
  开发板1.0.1
  开发板1.2.3
  ```

- 合并后

  ```txt
  开发板1.0.0
  开发板1.0.1
  <<<<<<< HEAD
  开发板1.2.2  master分支
  =======
  开发板1.2.3
  >>>>>>> hot_fix
  ```

需要几个步骤：

- 需要手动去选择取舍
- git add .
- git commit -m '日志信息'

## 11. 远程

### 11.1 添加远程仓库

```shell
git remote add origin '仓库地址'
```

### 11.2 提交本地代码

```shell
git push -u origin 线上分支
```

如果不是从最新版本修改的，代码会提交不上去，此时需要先从远程库拉取最新版，在进行推送

### 11.3 拉取线上代码

```shell
git pull origin 远程分支:本地分支
```

pill是fetch和merge的合并

### 11.4 克隆

```shell
git clone '远程地址'
```

克隆之后的三个效果

- 完整的把远程库下载到本地库
- 创建origin远程地址别名
- 初始化本地库

## 12. git配置文件

```bash
# 注释
*.txt   # 忽略所有以.txt结尾的文件
!lib.txt   # lib.txt除外
/node_modules   # 忽略node_modules目录下的文件
```

## 13. 比较diff

```bash
# 默认是工作区和暂存区之间的比较
# 不带文件名可以比较多个文件
git diff [文件名]
# 工作区和版本库之间的比较
git diff HEAD [文件名]
# 工作区和历史版本之间的比较
git diff HEAD^^ [文件名]
git diff HEAD~2 [文件名]
git diff [哈希值]
```

