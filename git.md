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

## 4. 将写好的项目添加到暂存区

```shell
git add .
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

### 8.1 前滚

```shell
git log
```

```shell
git reset –hard 版本号
```

### 8.2 后滚

```shell
git reflog
```

```shell
git reset –hard 版本号
```

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







## 11. 远程

### 11.1 添加远程仓库

```shell
git remote add origin '仓库地址'
```

### 11.2 提交本地代码

```shell
git push -u origin 线上分支
```

### 11.3 拉取线上代码

```shell
git pull origin 远程分支:本地分支
```

### 11.4 克隆

```shell
git clone '远程地址'
```

## 12. git配置文件

```bash
# 注释
*.txt   # 忽略所有以.txt结尾的文件
!lib.txt   # lib.txt除外
/node_modules   # 忽略node_modules目录下的文件
```

