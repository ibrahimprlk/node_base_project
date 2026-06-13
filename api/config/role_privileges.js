module.exports={
    privGroups :[
        {
            id: "User",
            name: "User Permissions"
        },
        {
            id: "Role",
            name: "Role Permissions"
        },
        {
            id: "Category",
            name: "Category Permissions"
        },
        {
            id: "AuditLogs",
            name: "AuditLogs Permissions"
        }
    ],

     Privileges: [
        {
            Key: "user_view",
            Name: "User View",
            Group: "User",
            Description: "User view"
        },
        {
            Key: "user_add",
            Name: "User Add",
            Group: "User",
            Description: "User Add"
        },
        {
            Key: "user_update",
            Name: "User Update",
            Group: "User",
            Description: "User Update"
        },
         {
            Key: "user_delete",
            Name: "User Delete",
            Group: "User",
            Description: "User Delete"
        },
        {
            Key: "role_view",
            Name: "Role View",
            Group: "Role",
            Description: "Role view"
        },
         {
            Key: "role_add",
            Name: "Role Add",
            Group: "Role",
            Description: "Role add"
        },
        {
            Key: "role_update",
            Name: "Role Update",
            Group: "Role",
            Description: "Role Update"
        },
        {
            Key: "role_delete",
            Name: "Role Delete",
            Group: "Role",
            Description: "Role Delete"
        },
        {
            Key: "category_view",
            Name: "Category View",
            Group: "Category",
            Description: "Category View"
        },
         {
            Key: "category_add",
            Name: "Category Add",
            Group: "Category",
            Description: "Category Add"
        },
         {
            Key: "category_update",
            Name: "Category Update",
            Group: "Category",
            Description: "Category Update"
        },
         {
            Key: "category_delete",
            Name: "Category Delete",
            Group: "Category",
            Description: "Category Delete"
        },
        {
            Key: "auditlogs_view",
            Name: "Auditlogs View",
            Group: "Auditlogs",
            Description: "Auditlogs View"
        },
    ]
}