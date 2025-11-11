let trList = document.querySelectorAll("tr");
let list = [];
let string = "";
trList.forEach((tr) => {
  let td = tr.querySelector("td");
  if (td) {
    const no = td
      .querySelector(".table-cell")
      .querySelectorAll("p")[2]
      .innerText.split("：")[1];
    const imie = td
      .querySelector(".table-cell")
      .querySelectorAll("p")[3]
      .innerText.split("：")[1];
    // console.log('{', imie, ":", no, "},")
    list.push(imie);
    string += `"${imie}",`;
  }
});
let textarea = document.createElement("textarea");
document.body.appendChild(textarea);
// 隐藏此输入框
textarea.style.position = "fixed";
textarea.style.clip = "rect(0 0 0 0)";
textarea.style.top = "10px";
// 赋值
textarea.value = string;
// 选中
textarea.select();
// 复制
document.execCommand("copy", true);
// 移除输入框
document.body.removeChild(textarea);

const data = [
  "GX6G2C200C6L",
  "GX4ZMWXNLKKT",
  "H31D2W8PLKKT",
  "GX4D59KDLKKT",
  "GWYC26VCLKKT",
  "GN1DFF2T0C6L",
  "GX6ZCB2MLKKT",
  "GWXCMEFCLKKT",
  "GXCGH1JF1059",
  "GX8FMTEP0C6L",
  "GRHF5EJL0C6L",
  "GX8FHC650C60L",
  "H2XDPQMP0C6L",
  "SH2YFN7P10C6L",
  "H2YGJK7G1059",
  "H2YCVJ07LKKT",
  "GRHCQ29LLKKT",
  "H31DMB6W0C6L",
  "GWXCNKQ5LKKT",
  "GX7F9R7M0C6L",
  "GWYZN2XJLKKT",
  "GWXD20K9LKKT",
  "GXCG6C3P1059",
  "gwycr51clkkt",
  "H6LDL5ET0C6L",
  "H6LDHJ0K0C6L",
  "GWYCKJSELKKT",
  "GWKC2C18LKKT",
  "GXCZWNPPLKKT",
  "GXCGV6GH1059",
  "H2XFWRG00C6L",
  "H2YDHHDB0C6L",
  "H1VCM4PHLKKT",
  "H6LD4L8SLKKT",
  "GXDG8UWV1059",
  "gx7dheu90c6l",
  "GWXCGQT1LKKT",
  "H1VD1LW4LKKT",
  "H2XFN46N0C6L",
  "GX2D6X4HLKKT",
  "GX9ZPPSDLKKT",
  "H2YDHBQS0C6L",
  "GX2ZW64ZLKKT",
  "GX8DV7X50C6L",
  "GWYZJZNULKKT",
  "GX2ZPJYNLKKT",
  "GWXZFF0GLKKT",
  "GXCFFAEDOC6L",
  "GX7ZXEFJLKKT",
  "H31FGMRY0C6L",
  "H1FHW1P31059",
  "GX4ZK7Z5LKKT",
  "GX7G4AGP0C6L",
  "H2YDHUVW0C6L",
  "GWYZJAY8LKKT",
  "GXDFQ8E50C6L",
  "H6XF4Y6G0C6L",
  "GX8G8JDF0C6L",
  "H1VD1DZNLKKT",
  "GX1C3HAVLKKT",
  "H6LDJAZP0C6L",
  "GXCZT2T0LKKT",
  "GX7DJ35W0C6L",
  "H6LDKS5H0C6L",
  "H2YGHTMV1059",
  "GWXZGUFBLKKT",
  "GXCZQHZCLKKT",
  "GX3DK04U0C6l",
  "GX6HD24LLKKT",
  "GN2CQ3GTLKKT",
  "GX6FFCW80C6L",
  "H2XDLSQZ0C6L",
  "GX7H36TPLKKT",
  "GX6H17VRLKKT",
  "GX6D6GNELKKT",
  "GXDCKUK2LKKT",
  "H2XFTTZB0C6L",
  "GX2ZGK6YLKKT",
  "H19KG2FC0C0L",
  "H2XDM7530C6L",
  "GX5ZPVMVLKKT",
  "H2XD6AN4LKKT",
  "H6NDP3MW0C6L",
  "GFJZQ5EELKKT",
  "GX7GDFKLLKKT7",
  "H6LDL8U80C6L",
  "gx2cwmyslkkt",
  "GX4ZJG7HLKKT",
  "H36D4FH0LKKT",
  "H1VCT8UHLKKT",
  "H2YD484QLKKT",
  "GX2D1U11LKKT",
  "GWYZJ8C3LKKT",
  "GXCDJT1Q0C6L",
  "H2YFHE1X0C6L",
  "h1dgflne1059",
  "GXDC9NRRLKKT",
  "H31FJ5D70C6L",
  "GX9ZJ922LKKT",
  "GWXDDHHRLKKT",
  "GX4ZWJQ7LKKT",
  "gx7zkbfmlkkt",
  "GX4DWBVM0T88",
  "GX6F5G9T0C6L",
  "GWKC4FGXLKKT",
  "H31D27U9LKKT",
  "GWYCM4PVLKKT",
  "H2XDR6YA0C6L",
  "GWXCRQHVLKKT",
  "GX8CF15MLKKT",
  "h2xfh9zv0c6l",
  "H2YDH2XT0C6L",
  "H2XF3MBL0C6L",
  "H2XCXXC1LKKT",
  "GX7G5J2H0C6L",
  "H31FFB280C6L",
  "GX9G819X0C6L",
  "gxcfnepk0c6l",
  "GX6ZRHNKLKKT",
  "GWKC9SG3LKKT",
];
