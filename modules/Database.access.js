const fs = require('node:fs')
const moment = require('moment')

const GetSchool = fs.readFileSync('./Utils/Students/school.json')
const School = JSON.parse(GetSchool)

const GetSchoolColor = fs.readFileSync('./.config/Game_Init_Config/BannerConfig/color.json')
const SchoolColor = JSON.parse(GetSchoolColor)

const GetStudentLogo = fs.readFileSync('./.config/Game_Init_Config/BannerConfig/logo.json')
const StudentIcon = JSON.parse(GetStudentLogo)

const GetBannerImgs = fs.readFileSync('./.config/Game_Init_Config/BannerConfig/bannerLink.json')
const BannerImgs = JSON.parse(GetBannerImgs)

const GetRaid = fs.readFileSync("./.config/Game_Init_Config/RaidConfig/raid.json");
const Raid = JSON.parse(GetRaid);

const GetColor = fs.readFileSync("./.config/Game_Init_Config/RaidConfig/raidColor.json");
const RaidColor = JSON.parse(GetColor)

async function TimeConvert(time, format) {
    return moment(time).format(format)
}

module.exports = {TimeConvert, School, StudentIcon, SchoolColor, BannerImgs, Raid, RaidColor};