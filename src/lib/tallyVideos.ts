export interface TallyVideo {
  id: number;
  section: string;
  title: string;
  src: string;
}

export const TALLY_VIDEOS: TallyVideo[] = [
  // Introduction to Tally
  { id: 1,  section: "Introduction to Tally",               title: "Introduction to Tally",                                          src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70623/tallyerp9-reedited/1655115434538_301751_VOD1080p30.m3u8" },
  { id: 2,  section: "Introduction to Tally",               title: "Getting familiar to Gateway of Tally",                           src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70654/tallyerp9-reedited/1655115594196_765601_VOD1080p30.m3u8" },
  // Accounting Transaction
  { id: 3,  section: "Accounting Transaction",              title: "Introduction to Accounting Ledgers & Capital Transaction",        src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70728/tallyerp9-reedited/1655116200333_810449_VOD1080p30.m3u8" },
  { id: 4,  section: "Accounting Transaction",              title: "Accounting Transactions in Tally",                                src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70733/tallyerp9-reedited/1655116282196_181074_VOD1080p30.m3u8" },
  { id: 5,  section: "Accounting Transaction",              title: "Accounting Reports in Tally",                                     src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70739/tallyerp9-reedited/1655116334140_498891_VOD1080p30.m3u8" },
  // Business Transactions and Reports
  { id: 6,  section: "Business Transactions and Reports",   title: "Business Transaction for Purchase in Tally",                     src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70754/tallyerp9-reedited/1655116605055_414510_VOD1080p30.m3u8" },
  { id: 7,  section: "Business Transactions and Reports",   title: "Business Transaction for Sale in Tally",                         src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70755/tallyerp9-reedited/1655116621654_674404_VOD1080p30.m3u8" },
  { id: 8,  section: "Business Transactions and Reports",   title: "Other Business Transactions in Tally",                           src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70757/tallyerp9-reedited/1655116649898_674478_VOD1080p30.m3u8" },
  { id: 9,  section: "Business Transactions and Reports",   title: "Reports Generation for Business Transaction in Tally",           src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70758/tallyerp9-reedited/1655116663812_546998_VOD1080p30.m3u8" },
  { id: 10, section: "Business Transactions and Reports",   title: "Introduction to Inventory",                                      src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70760/tallyerp9-reedited/1655116695191_551504_VOD1080p30.m3u8" },
  { id: 11, section: "Business Transactions and Reports",   title: "Unit Of Measure & Closing Stock",                                src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70763/tallyerp9-reedited/1655116717937_953589_VOD1080p30.m3u8" },
  // Introduction of GST
  { id: 12, section: "Introduction of GST",                 title: "GST Introduction",                                               src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70764/tallyerp9-reedited/1655116745033_402321_VOD1080p30.m3u8" },
  { id: 13, section: "Introduction of GST",                 title: "GST Advantages & GST Number",                                    src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70766/tallyerp9-reedited/1655116764692_447500_VOD1080p30.m3u8" },
  { id: 14, section: "Introduction of GST",                 title: "HSN Code & GST Rate",                                            src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70767/tallyerp9-reedited/1655116793139_290119_VOD1080p30.m3u8" },
  { id: 15, section: "Introduction of GST",                 title: "TAX Calculation in Tally",                                       src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70768/tallyerp9-reedited/1655116804517_680144_VOD1080p30.m3u8" },
  // ITC Liability Payment
  { id: 16, section: "ITC Liability Payment",               title: "ITC Adjustment & ITC Setoff",                                    src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70771/tallyerp9-reedited/1655116813984_433879_VOD1080p30.m3u8" },
  { id: 17, section: "ITC Liability Payment",               title: "Understanding GST Return Filling with Example",                  src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70772/tallyerp9-reedited/1655116841363_384831_VOD1080p30.m3u8" },
  { id: 18, section: "ITC Liability Payment",               title: "GST Setup & Inventory Setup in Tally",                           src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70775/tallyerp9-reedited/1655116853129_430729_VOD1080p30.m3u8" },
  // GST Transaction Report and Payment
  { id: 19, section: "GST Transaction Report and Payment",  title: "GST Transaction Report",                                         src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70777/tallyerp9-reedited/1655116877952_628012_VOD1080p30.m3u8" },
  { id: 20, section: "GST Transaction Report and Payment",  title: "GST Sales Transaction",                                          src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70780/tallyerp9-reedited/1655116907615_841221_VOD1080p30.m3u8" },
  { id: 21, section: "GST Transaction Report and Payment",  title: "GST Reports & ITC",                                              src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70783/tallyerp9-reedited/1655116934056_49113_VOD1080p30.m3u8" },
  // Eway Bill
  { id: 22, section: "Eway Bill",                           title: "E-Way Bill Configuration And Transaction in Tally",              src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70788/tallyerp9-reedited/1655116966547_82444_VOD1080p30.m3u8" },
  { id: 23, section: "Eway Bill",                           title: "Career Guideline",                                               src: "https://videos.learnvern.com/2818117345/2818117345_720.m3u8" },
  // Banking Transaction
  { id: 24, section: "Banking Transaction",                 title: "Banking Transactions in Tally",                                  src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70792/tallyerp9-reedited/1655116991811_264134_VOD1080p30.m3u8" },
  { id: 25, section: "Banking Transaction",                 title: "Banking Reconciliation & Cheque Printing in Tally",              src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70804/tallyerp9-reedited/1655117007425_200844_VOD1080p30.m3u8" },
  { id: 26, section: "Banking Transaction",                 title: "Other Transactions in Tally",                                    src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70811/tallyerp9-reedited/1655117055272_318313_VOD1080p30.m3u8" },
  // Budget and Operating Expense
  { id: 27, section: "Budget and Operating Expense",        title: "Introduction to Budget in Tally",                                src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70823/tallyerp9-reedited/1655117082088_920096_VOD1080p30.m3u8" },
  { id: 28, section: "Budget and Operating Expense",        title: "Operating Expense Transactions in Tally",                        src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70836/tallyerp9-reedited/1655117114080_501896_VOD1080p30.m3u8" },
  { id: 29, section: "Budget and Operating Expense",        title: "Fix Assets Transactions in Tally",                               src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70848/tallyerp9-reedited/1655117171669_863994_VOD1080p30.m3u8" },
  // Cost Centers
  { id: 30, section: "Cost Centers",                        title: "Cost Centre Transaction in Tally",                               src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70617/tallyerp9-reedited/1655115363490_563241_VOD1080p30.m3u8" },
  { id: 31, section: "Cost Centers",                        title: "Predefine Cost Centers in Tally",                                src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70621/tallyerp9-reedited/1655115411388_974719_VOD1080p30.m3u8" },
  // Voucher Type and Interest Calculation
  { id: 32, section: "Voucher Type and Interest Calculation", title: "Voucher Type & Voucher Class in Tally",                        src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70628/tallyerp9-reedited/1655115454595_33850_VOD1080p30.m3u8" },
  { id: 33, section: "Voucher Type and Interest Calculation", title: "Simple Interest Calculation in Tally",                         src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70633/tallyerp9-reedited/1655115499612_289738_VOD1080p30.m3u8" },
  { id: 34, section: "Voucher Type and Interest Calculation", title: "Bank Overdraft Interest Calculation in Tally",                 src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70639/tallyerp9-reedited/1655115538154_996450_VOD1080p30.m3u8" },
  { id: 35, section: "Voucher Type and Interest Calculation", title: "Compound Interest Calculation in Tally",                       src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70646/tallyerp9-reedited/1655115567046_563342_VOD1080p30.m3u8" },
  // Procurement Process
  { id: 36, section: "Procurement Process",                 title: "Introduction to Procurement Process",                            src: "https://videos.learnvern.com/2814379124/2814379124_720.m3u8" },
  { id: 37, section: "Procurement Process",                 title: "Procurement Transactions in Tally",                              src: "https://videos.learnvern.com/2814373057/2814373057_720.m3u8" },
  { id: 38, section: "Procurement Process",                 title: "Preclose Order in Tally",                                        src: "https://videos.learnvern.com/2814376513/2814376513_720.m3u8" },
  // Sales Process
  { id: 39, section: "Sales Process",                       title: "Sales Process & Transactions in Tally",                          src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70661/tallyerp9-reedited/1655115630261_385505_VOD1080p30.m3u8" },
  { id: 40, section: "Sales Process",                       title: "Generating Sales Process Reports in Tally",                      src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70669/tallyerp9-reedited/1655115657128_230129_VOD1080p30.m3u8" },
  // POS - Point of Sale
  { id: 41, section: "POS - Point of Sale",                 title: "POS in Tally",                                                   src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70677/tallyerp9-reedited/1655115685234_321105_VOD1080p30.m3u8" },
  // Godown and Bill Quantity Discount
  { id: 42, section: "Godown and Bill Quantity Discount",   title: "Introduction to Godown Transactions in Tally",                   src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70685/tallyerp9-reedited/1655115719953_794992_VOD1080p30.m3u8" },
  { id: 43, section: "Godown and Bill Quantity Discount",   title: "Billed Quantity Discount in Tally",                              src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70689/tallyerp9-reedited/1655115745654_873984_VOD1080p30.m3u8" },
  // Stock Category and Price List
  { id: 44, section: "Stock Category and Price List",       title: "Stock Category in Tally",                                        src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70694/tallyerp9-reedited/1655115780367_633559_VOD1080p30.m3u8" },
  { id: 45, section: "Stock Category and Price List",       title: "Price List in Tally",                                            src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70697/tallyerp9-reedited/1655115802636_915612_VOD1080p30.m3u8" },
  // Multi Currency
  { id: 46, section: "Multi Currency",                      title: "Multi Currency in Tally",                                        src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70703/tallyerp9-reedited/1655115843379_116289_VOD1080p30.m3u8" },
  // Manufacturing Process
  { id: 47, section: "Manufacturing Process",               title: "Introduction to Manufacturing Process in Tally",                 src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70707/tallyerp9-reedited/1655115889200_328828_VOD1080p30.m3u8" },
  { id: 48, section: "Manufacturing Process",               title: "Manufacturing Process Transactions in Tally",                    src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70709/tallyerp9-reedited/1655115947269_138333_VOD1080p30.m3u8" },
  { id: 49, section: "Manufacturing Process",               title: "Understanding Manufacturing Process with By-Product in Tally",   src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70712/tallyerp9-reedited/1655115979978_263321_VOD1080p30.m3u8" },
  // Item Cost Tracking and Batch Detail
  { id: 50, section: "Item Cost Tracking and Batch Detail", title: "Item Cost Tracking in Tally",                                    src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70716/tallyerp9-reedited/1655116031091_76975_VOD1080p30.m3u8" },
  { id: 51, section: "Item Cost Tracking and Batch Detail", title: "Batch Details in Tally",                                         src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70719/tallyerp9-reedited/1655116070169_470071_VOD1080p30.m3u8" },
  // MIS Reports
  { id: 52, section: "MIS Reports",                         title: "Financial MIS Reports in Tally",                                 src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70722/tallyerp9-reedited/1655116111695_167489_VOD1080p30.m3u8" },
  { id: 53, section: "MIS Reports",                         title: "Inventory MIS Report in Tally",                                  src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70725/tallyerp9-reedited/1655116157794_865620_VOD1080p30.m3u8" },
  { id: 54, section: "MIS Reports",                         title: "Mix Supply in Tally",                                            src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70731/tallyerp9-reedited/1655116234992_394972_VOD1080p30.m3u8" },
  { id: 55, section: "MIS Reports",                         title: "GST Detail Report in Tally",                                     src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70737/tallyerp9-reedited/1655116299928_558505_VOD1080p30.m3u8" },
  // Payroll
  { id: 56, section: "Payroll",                             title: "Introduction of Payroll",                                        src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70742/tallyerp9-reedited/1655116346564_427461_VOD1080p30.m3u8" },
  { id: 57, section: "Payroll",                             title: "Payroll Transactions in Tally",                                  src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70744/tallyerp9-reedited/1655116391528_380452_VOD1080p30.m3u8" },
  { id: 58, section: "Payroll",                             title: "Payroll Reports in Tally",                                       src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70745/tallyerp9-reedited/1655116439507_498548_VOD1080p30.m3u8" },
  { id: 59, section: "Payroll",                             title: "Payroll Statutory Reports in Tally",                             src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70747/tallyerp9-reedited/1655116468272_21486_VOD1080p30.m3u8" },
  { id: 60, section: "Payroll",                             title: "Additional Functionalities in Tally",                            src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70749/tallyerp9-reedited/1655116498885_222815_VOD1080p30.m3u8" },
  { id: 61, section: "Payroll",                             title: "Introduction to Tally Prime",                                    src: "https://videos.learnvern.com/file_library/videos/vod_non_drm_ios/70752/tallyerp9-reedited/1655116558721_286294_VOD1080p30.m3u8" },
];

export const SECTIONS = [...new Set(TALLY_VIDEOS.map(v => v.section))];
