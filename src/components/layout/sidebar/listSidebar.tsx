export const ListNav = [
	{
		id: "dashboard",
		link: "/dashboard",
		title: "Dashboard",
		role: "all",
		subMenu: null,
	},
	// {
	// 	id: "master-data",
	// 	link: "/master-data",
	// 	title: "Master Data",
	// 	role: "all",
	// 	subMenu: [
	// 		{
	// 		    id: 'supplier',
	// 		    link: "/master-data/supplier",
	// 		    title: "Supplier",
	// 		    subMenu: null
	// 		},
	// 		{
	// 		    id: 'customer',
	// 		    link: "/master-data/customer",
	// 		    title: "Customer",
	// 		    subMenu: null
	// 		},
	// 		{
	// 		    id: 'employe',
	// 		    link: "/master-data/employe",
	// 		    title: "Employe",
	// 		    subMenu: null
	// 		},
	// 		{
	// 		    id: 'equipment-part',
	// 		    link: "/master-data/equipment-part",
	// 		    title: "Equipment & Part",
	// 		    subMenu: null
	// 		},
	// 		{
	// 			id: "departement",
	// 			link: "/master-data/departement",
	// 			title: "Departement",
	// 			subMenu: null,
	// 		},
	// 		{
	// 		    id: 'worker-center',
	// 		    link: "/master-data/worker-center",
	// 		    title: "Worker Center",
	// 		    subMenu: null
	// 		},
	// 		{
	// 			id: "activity",
	// 			link: "/master-data/activity",
	// 			title: "Activity",
	// 			subMenu: null,
	// 		},
	// 		{
	// 		    id: 'holiday',
	// 		    link: "/master-data/holiday",
	// 		    title: "Holiday",
	// 		    subMenu: null
	// 		},
	// 		{
	// 			id: "material-type",
	// 			link: "/master-data/material-type",
	// 			title: "Material Type",
	// 			subMenu: null,
	// 		},
	// 		{
	// 			id: "material",
	// 			link: "/master-data/material",
	// 			title: "Material",
	// 			subMenu: null,
	// 		},
	// 	],
	// },
	{
		id: "public",
		link: "/public",
		title: "Public",
		role: "all",
		subMenu: [
			{
				id: "mr",
				link: "/public/mr",
				title: "MR",

				subMenu: null,
			},
			{
				id: "sr",
				link: "/public/sr",
				title: "SR",

				subMenu: null,
			},
			{
				id: "cash-advance",
				link: "/public/cash-advance",
				title: "Cash Advance",

				subMenu: null,
			},
			{
				id: "spj-cash-advance",
				link: "/public/spj-cash-advance",
				title: "SPJ Cash Advance",

				subMenu: null,
			},
			{
				id: "time-sheet",
				link: "/public/time-sheet",
				title: "Time Sheet",

				subMenu: null,
			},
			// {
			// 	id: "permit-request",
			// 	link: "/public/permit-request",
			// 	title: "Permit Request",

			// 	subMenu: null,
			// },
			// {
			// 	id: "dispatch-record",
			// 	link: "/public/dispatch-record",
			// 	title: "Dispatch Record",

			// 	subMenu: null,
			// },
			{
				id: "employe",
				link: "/public/employe",
				title: "Employe",
				subMenu: null,
			},
			// {
			// 	id: "absen-today",
			// 	link: "/public/absen-today",
			// 	title: "Absen Today",

			// 	subMenu: null,
			// },
			{
				id: "master-material",
				link: "/public/master-material",
				title: "Master Material",

				subMenu: null,
			},
			{
				id: "work-order-release",
				link: "/public/work-order-release",
				title: "Work Order Release",

				subMenu: null,
			},
		],
	},
	{
		id: "marketing",
		link: "/marketing",
		title: "Marketing",
		role: "ADMINISTRATOR, MARKETING SWASTA, MARKETING BUMN",
		subMenu: [
			{
				id: "customer",
				link: "/marketing/customer",
				title: "Customer",
				subMenu: null,
			},
			{
				id: "quotation",
				link: "/marketing/quotation",
				title: "Quotation",

				subMenu: null,
			},
			{
				id: "customer-po",
				link: "/marketing/customer-po",
				title: "Customer PO",

				subMenu: null,
			},
			{
				id: "work-order-release",
				link: "/marketing/work-order-release",
				title: "Work Order Release",

				subMenu: null,
			},
			// {
			// 	id: "marketing-opurtunity",
			// 	link: "/marketing/marketing-opurtunity",
			// 	title: "Marketing Opurtunity",

			// 	subMenu: null,
			// },
			// {
			// 	id: "sales-performance",
			// 	link: "/marketing/sales-performance",
			// 	title: "Sales Performance",

			// 	subMenu: null,
			// },
			{
				id: "job-status",
				link: "/marketing/job-status",
				title: "Job Status",
				subMenu: null,
			},,
			{
				id: "material-stok",
				link: "/marketing/material-stok",
				title: "Material Stok",
				subMenu: null,
			},
		],
	},
	{
		id: "purchasing-logistic",
		link: "/purchasing-logistic",
		title: "Purchasing",
		role: "ADMINISTRATOR,PURCHASING",
		subMenu: [
			{
				id: "supplier",
				link: "/purchasing-logistic/supplier",
				title: "Supplier",
				subMenu: null,
			},
			{
				id: "approval-mr",
				link: "/purchasing-logistic/approval-mr",
				title: "Approval MR",

				subMenu: null,
			},
			{
				id: "approval-sr",
				link: "/purchasing-logistic/approval-sr",
				title: "Approval SR",

				subMenu: null,
			},
			// {
			// 	id: "spj-purchase",
			// 	link: "/purchasing-logistic/spj-purchase",
			// 	title: "SPJ Purchase",

			// 	subMenu: null,
			// },
			{
				id: "purchase-mr",
				link: "/purchasing-logistic/purchase-mr",
				title: "Purchase MR",

				subMenu: null,
			},
			{
				id: "purchase-sr",
				link: "/purchasing-logistic/purchase-sr",
				title: "Purchase SR",

				subMenu: null,
			},
			{
				id: "direct-mr",
				link: "/purchasing-logistic/direct-mr",
				title: "Direct MR",

				subMenu: null,
			},
			{
				id: "direct-sr",
				link: "/purchasing-logistic/direct-sr",
				title: "Direct SR",

				subMenu: null,
			},
			{
				id: "purchase-order",
				link: "/purchasing-logistic/purchase-order",
				title: "Purchase Order",

				subMenu: null,
			},
			{
				id: "service-order",
				link: "/purchasing-logistic/service-order",
				title: "Service Order",

				subMenu: null,
			},
			{
				id: "list-po",
				link: "/purchasing-logistic/list-po",
				title: "List PO",

				subMenu: null,
			},
			{
				id: "list-so",
				link: "/purchasing-logistic/list-so",
				title: "List SO",

				subMenu: null,
			},
			{
				id: "list-dirrect-purchase",
				link: "/purchasing-logistic/list-dirrect-purchase",
				title: "List Dirrect Purchase",

				subMenu: null,
			},
			{
				id: "list-dirrect-service",
				link: "/purchasing-logistic/list-dirrect-service",
				title: "List Dirrect Service",

				subMenu: null,
			},
			// {
			// 	id: "purchase-receive",
			// 	link: "/purchasing-logistic/purchase-receive",
			// 	title: "Purchase Receive",

			// 	subMenu: null,
			// },
			// {
			// 	id: "service-receive",
			// 	link: "/purchasing-logistic/service-receive",
			// 	title: "Service Receive",

			// 	subMenu: null,
			// },
			// {
			// 	id: "outgoing-material",
			// 	link: "/purchasing-logistic/outgoing-material",
			// 	title: "Outgoing Material",

			// 	subMenu: null,
			// },
			// {
			// 	id: "delivery-order",
			// 	link: "/purchasing-logistic/delivery-order",
			// 	title: "Delivery Order",

			// 	subMenu: null,
			// },
			// {
			// 	id: "material-remaind-use",
			// 	link: "/purchasing-logistic/material-remaind-use",
			// 	title: "Material Remain Use",

			// 	subMenu: null,
			// },
			// {
			// 	id: "equipment-part",
			// 	link: "/purchasing-logistic/equipment-part",
			// 	title: "Equipment & Part",
			// 	subMenu: null,
			// },
			// {
			// 	id: "material-type",
			// 	link: "/purchasing-logistic/material-type",
			// 	title: "Material Type",
			// 	subMenu: null,
			// },
			// {
			// 	id: "material",
			// 	link: "/purchasing-logistic/material",
			// 	title: "Material",
			// 	subMenu: null,
			// },
			// {
			// 	id: "warehouse",
			// 	link: "/purchasing-logistic/warehouse",
			// 	title: "Warehouse",
			// 	subMenu: null,
			// },
		],
	},
	{
		id: "general-affair",
		link: "/general-affair",
		title: "General Affair & Logistic",
		role: "ADMINISTRATOR,PURCHASING",
		subMenu: [
			{
				id: "purchase-receive",
				link: "/general-affair/purchase-receive",
				title: "Purchase Receive",

				subMenu: null,
			},
			{
				id: "outgoing-material",
				link: "/general-affair/outgoing-material",
				title: "Outgoing Material",

				subMenu: null,
			},
			{
				id: "delivery-order",
				link: "/general-affair/delivery-order",
				title: "Delivery Order",

				subMenu: null,
			},
			{
				id: "material-remaind-use",
				link: "/general-affair/material-remaind-use",
				title: "Material Remain Use",

				subMenu: null,
			},
			{
				id: "equipment-part",
				link: "/general-affair/equipment-part",
				title: "Equipment & Part",
				subMenu: null,
			},
			// {
			// 	id: "material-type",
			// 	link: "/general-affair/material-type",
			// 	title: "Material Type",
			// 	subMenu: null,
			// },
			// {
			// 	id: "material",
			// 	link: "/general-affair/material",
			// 	title: "Material",
			// 	subMenu: null,
			// },
			{
				id: "warehouse",
				link: "/general-affair/warehouse",
				title: "Warehouse",
				subMenu: null,
			},
		]
	},
	{
		id: "director",
		link: "/director",
		title: "Director",
		role: "ADMINISTRATOR",
		subMenu: [
			{
				id: "approval",
				link: "/director/approval",
				title: "Approval",

				subMenu: null,
			},
			// {
			// 	id: "approval Po",
			// 	link: "/director/approvalPo",
			// 	title: "Approval PO",

			// 	subMenu: null,
			// },
			{
				id: "approval MR",
				link: "/director/approvalMr",
				title: "Approval MR",

				subMenu: null,
			},
			{
				id: "approval SR",
				link: "/director/approvalSr",
				title: "Approval SR",

				subMenu: null,
			},
			// {
			// 	id: "job-cost-manhour",
			// 	link: "/director/job-cost-manhour",
			// 	title: "Job Cost & Man Hour",

			// 	subMenu: null,
			// },
			// {
			// 	id: "cash-advance-list",
			// 	link: "/director/cash-advance-list",
			// 	title: "Cash Advance List",

			// 	subMenu: null,
			// },
			// {
			// 	id: "payment-schedule",
			// 	link: "/director/payment-schedule",
			// 	title: "Payment Schedule",

			// 	subMenu: null,
			// },
		],
	},
	{
		id: "finance-accounting",
		link: "/finance-accounting",
		title: "Finance & Accounting",
		role: "ADMINISTRATOR,FINANCE & ACC",
		subMenu: [
			// {
			// 	id: "open-close-cashier",
			// 	link: "/finance-accounting/open-close-cashier",
			// 	title: "Open/Close Cashier",

			// 	subMenu: null,
			// },
			{
				id: "cashier",
				link: "/finance-accounting/cashier",
				title: "Cashier",

				subMenu: null,
			},
			// {
			// 	id: "general-payment",
			// 	link: "/finance-accounting/general-payment",
			// 	title: "General Payment",

			// 	subMenu: null,
			// },
			{
				id: "chart-of-accounts",
				link: "/finance-accounting/chart-of-accounts",
				title: "Charts Of Accounts",

				subMenu: null,
			},
			{
				id: "kontra-bon",
				link: "/finance-accounting/kontra-bon",
				title: "kontra Bon",

				subMenu: null,
			},
			{
				id: "due-payment",
				link: "/finance-accounting/due-payment",
				title: "Due Payment",

				subMenu: null,
			},
			{
				id: "posting",
				link: "/finance-accounting/posting",
				title: "Posting",

				subMenu: null,
			},
			{
				id: "journal",
				link: "/finance-accounting/journal",
				title: "Journal",

				subMenu: null,
			},
			// {
			// 	id: "memorial-joural",
			// 	link: "/finance-accounting/memorial-joural",
			// 	title: "Memorial Journal",

			// 	subMenu: null,
			// },
			// {
			// 	id: "accountability-approval",
			// 	link: "/finance-accounting/accountability-approval",
			// 	title: "Accountability Approval",

			// 	subMenu: null,
			// },
			// {
			// 	id: "transactions-per-day",
			// 	link: "/finance-accounting/transactions-per-day",
			// 	title: "Transactions Per Day",

			// 	subMenu: null,
			// },
			// {
			// 	id: "transactions-per-account",
			// 	link: "/finance-accounting/transactions-per-account",
			// 	title: "Transactions Per Account",

			// 	subMenu: null,
			// },
			// {
			// 	id: "cash-advance-control",
			// 	link: "/finance-accounting/cash-advance-control",
			// 	title: "Cash Advance Control",

			// 	subMenu: null,
			// },
			// {
			// 	id: "purchasing-control",
			// 	link: "/finance-accounting/purchasing-control",
			// 	title: "Purchasing Control",

			// 	subMenu: null,
			// },
			// {
			// 	id: "general-control",
			// 	link: "/finance-accounting/general-control",
			// 	title: "General Control",

			// 	subMenu: null,
			// },
			// {
			// 	id: "update-patycash",
			// 	link: "/finance-accounting/update-patycash",
			// 	title: "Update Patycash",

			// 	subMenu: null,
			// },
			// {
			// 	id: "purchasing-report",
			// 	link: "/finance-accounting/purchasing-report",
			// 	title: "Purchasing Report",

			// 	subMenu: null,
			// },
			// {
			// 	id: "closing-form",
			// 	link: "/finance-accounting/closing-form",
			// 	title: "Closing Form",

			// 	subMenu: null,
			// },
		],
	},
	{
		id: "hrd-ga",
		link: "/hrd-ga",
		title: "HRD & GA",
		role: "ADMINISTRATOR, HR & GA",
		subMenu: [
			{
				id: "employe",
				link: "/hrd-ga/employe",
				title: "Employe",
				subMenu: null,
			},
			{
				id: "departement",
				link: "/hrd-ga/departement",
				title: "Departement",
				subMenu: null,
			},
			{
				id: "register-new-user",
				link: "/hrd-ga/register-new-user",
				title: "Register New User",

				subMenu: null,
			},
			{
				id: "time-sheet",
				link: "/hrd-ga/time-sheet",
				title: "Time Sheet",
				subMenu: null,
			},
			{
				id: "sallary-overtime",
				link: "/hrd-ga/sallary-overtime",
				title: "Sallary & Overtime",

				subMenu: null,
			},
			{
				id: "absent-list",
				link: "/hrd-ga/absent-list",
				title: "Absent List",

				subMenu: null,
			},
			{
				id: "spd",
				link: "/hrd-ga/spd",
				title: "SPD",

				subMenu: null,
			},
		],
	},
	{
		id: "production",
		link: "/production",
		title: "Production",
		role: "ADMINISTRATOR,Ppic",
		subMenu: [
			// {
			// 	id: "shift",
			// 	link: "/production/shift",
			// 	title: "Shift",

			// 	subMenu: null,
			// },
			{
				id: "dispatch",
				link: "/production/dispatch",
				title: "Dispatch",

				subMenu: null,
			},
			{
				id: "time-schedule",
				link: "/production/time-schedule",
				title: "Time Schedule",

				subMenu: null,
			},
			{
				id: "dispatch-record",
				link: "/production/dispatch-record",
				title: "Dispatch Record",

				subMenu: null,
			},
			// {
			// 	id: "worker-center",
			// 	link: "/production/worker-center",
			// 	title: "Worker Center",

			// 	subMenu: null,
			// },
			// {
			// 	id: "job-status",
			// 	link: "/production/job-status",
			// 	title: "Job Status",

			// 	subMenu: null,
			// },
			// {
			// 	id: "mr-sr-status",
			// 	link: "/production/mr-sr-status",
			// 	title: "MR/SR Status",

			// 	subMenu: null,
			// },
			// {
			// 	id: "activity",
			// 	link: "/production/activity",
			// 	title: "Activity",
			// 	subMenu: null,
			// },
			{
				id: "equipment-part",
				link: "/production/equipment-part",
				title: "Equipment & Part",
				subMenu: null,
			},
		],
	},
	{
		id: "engineering",
		link: "/engineering",
		title: "Engineering",
		role: "ADMINISTRATOR,QA & ENG",
		subMenu: [
			{
				id: "sumary-report",
				link: "/engineering/sumary-report",
				title: "Sumary Report",

				subMenu: null,
			},
			{
				id: "bill-of-material",
				link: "/engineering/bill-of-material",
				title: "Bill Of Material",

				subMenu: null,
			},
			// {
			// 	id: "bom-dimension",
			// 	link: "/engineering/bom-dimension",
			// 	title: "BOM Dimension",

			// 	subMenu: null,
			// },
			{
				id: "drawing",
				link: "/engineering/drawing",
				title: "Drawing",

				subMenu: null,
			},
			// {
			// 	id: "equipment-part",
			// 	link: "/engineering/equipment-part",
			// 	title: "Equipment & Part",
			// 	subMenu: null,
			// },
			// {
			// 	id: "material-type",
			// 	link: "/engineering/material-type",
			// 	title: "Material Type",
			// 	subMenu: null,
			// },
			// {
			// 	id: "material",
			// 	link: "/engineering/material",
			// 	title: "Material",
			// 	subMenu: null,
			// },
		],
	},
	{
		id: "report",
		link: "/report",
		title: "Report",
		role: "ADMINISTRATOR",
		subMenu: [
			{
				id: "material-name-info",
				link: "/report/material-name-info",
				title: "Material Name Info",

				subMenu: null,
			},
			{
				id: "remove-mr-sr",
				link: "/report/remove-mr-sr",
				title: "Remove MR/SR",

				subMenu: null,
			},
			{
				id: "material-stok",
				link: "/report/material-stok",
				title: "Material Stok",
				subMenu: null,
			},
			{
				id: "payment-schedule",
				link: "/report/payment-schedule",
				title: "Payment Schedule",

				subMenu: null,
			},
			{
				id: "purchasing-list",
				link: "/report/purchasing-list",
				title: "Purchasing List",

				subMenu: null,
			},
			{
				id: "outgoing-list",
				link: "/report/outgoing-list",
				title: "Outgoing List",

				subMenu: null,
			},
			{
				id: "mr-sr-by-job",
				link: "/report/mr-sr-by-job",
				title: "MR/SR By Job",

				subMenu: null,
			},
			{
				id: "incoming-purchase-report",
				link: "/report/incoming-purchase-report",
				title: "Incoming Purchase Report",

				subMenu: null,
			},
			{
				id: "outgoing-material-report",
				link: "/report/outgoing-material-report",
				title: "Outgoing Material Report",

				subMenu: null,
			},
		],
	},
	{
		id: "utility",
		link: "/utility",
		title: "Utility",
		role: "ADMINISTRATOR,Utility/ty",
		subMenu: [
			{
				id: "invoice",
				link: "/utility/invoice",
				title: "Invoice",

				subMenu: null,
			},
			{
				id: "spj-purchase",
				link: "/utility/spj-purchase",
				title: "SPJ Purchase",

				subMenu: null,
			},
			{
				id: "absen-dl-setting",
				link: "/utility/absen-dl-setting",
				title: "Absen Dl Setting",

				subMenu: null,
			},
			{
				id: "register-new-user",
				link: "/utility/register-new-user",
				title: "Register New User",

				subMenu: null,
			},
			{
				id: "holiday-setting",
				link: "/utility/holiday-setting",
				title: "Holiday Setting",

				subMenu: null,
			},
			{
				id: "spd",
				link: "/utility/spd",
				title: "SPD",

				subMenu: null,
			},
			{
				id: "inventory-check-balance",
				link: "/utility/inventory-check-balance",
				title: "Inventory Check Balance",

				subMenu: null,
			},
			{
				id: "incoming-statement",
				link: "/utility/incoming-statement",
				title: "Incoming Statement",

				subMenu: null,
			},
			{
				id: "personal-loan",
				link: "/utility/personal-loan",
				title: "Personal Loan",

				subMenu: null,
			},
			{
				id: "payrol",
				link: "/utility/payrol",
				title: "Payrol",

				subMenu: null,
			},
			{
				id: "chart-of-accounts",
				link: "/utility/chart-of-accounts",
				title: "Charts Of Accounts",

				subMenu: null,
			},
			{
				id: "beginning-balance",
				link: "/utility/beginning-balance",
				title: "Beginning Balance",

				subMenu: null,
			},
			{
				id: "cash-advance",
				link: "/utility/cash-advance",
				title: "Cash Advance",

				subMenu: null,
			},
			{
				id: "approval-cash-advance",
				link: "/utility/approval-cash-advance",
				title: "Approval Cash Advance",

				subMenu: null,
			},
			{
				id: "spj-cash-advance",
				link: "/utility/spj-cash-advance",
				title: "SPJ Cash Advance",

				subMenu: null,
			},
		],
	},
];
