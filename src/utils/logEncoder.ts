/**
 * 日誌編碼工具 - 用於 Discord Bot 整合
 */

/**
 * 將日誌內容編碼為 Base64 URL 安全格式
 * @param content - 日誌內容
 * @returns Base64 編碼的字符串
 */
export function encodeLogContent(content: string): string {
  // 移除可能導致問題的字符並編碼
  const cleanContent = content.trim();
  return btoa(encodeURIComponent(cleanContent));
}

/**
 * 生成日誌編輯器連結 (主頁面，用於編輯和格式化)
 * @param baseUrl - 網站基本 URL (例如: https://yoursite.lovable.app)
 * @param logName - 日誌名稱
 * @param content - 日誌內容
 * @param guildId - Discord 伺服器 ID (可選)
 * @returns 完整的編輯器連結
 */
export function generateLogEditorUrl(
  baseUrl: string,
  logName: string,
  content: string,
  guildId?: string
): string {
  const encodedContent = encodeLogContent(content);
  const encodedName = encodeURIComponent(logName);
  
  let url = `${baseUrl}/?data=${encodedContent}&name=${encodedName}`;
  
  if (guildId) {
    url += `&guild=${guildId}`;
  }
  
  return url;
}

/**
 * 生成日誌查看器連結 (僅查看，不可編輯)
 * @param baseUrl - 網站基本 URL (例如: https://yoursite.lovable.app)
 * @param logName - 日誌名稱
 * @param content - 日誌內容
 * @param guildId - Discord 伺服器 ID (可選)
 * @returns 完整的查看器連結
 */
export function generateLogViewerUrl(
  baseUrl: string,
  logName: string,
  content: string,
  guildId?: string
): string {
  const encodedContent = encodeLogContent(content);
  const encodedName = encodeURIComponent(logName);
  const timestamp = Date.now();
  
  let url = `${baseUrl}/#/log/${timestamp}?data=${encodedContent}&name=${encodedName}`;
  
  if (guildId) {
    url += `&guild=${guildId}`;
  }
  
  return url;
}

/**
 * 解碼日誌內容
 * @param encodedContent - Base64 編碼的內容
 * @returns 原始日誌內容
 */
export function decodeLogContent(encodedContent: string): string {
  try {
    return decodeURIComponent(atob(encodedContent));
  } catch (error) {
    throw new Error('Invalid encoded content');
  }
}

/**
 * Discord Bot 專用：生成渲染器連結的 JavaScript 代碼
 * 您需要將此函數整合到您的 Discord Bot 中
 */
export const discordBotIntegrationCode = `
// 在您的 Discord Bot 中使用的函數
function generateRendererLink(baseUrl, logName, content, guildId) {
  // Base64 編碼函數
  function encodeLogContent(content) {
    const cleanContent = content.trim();
    return Buffer.from(encodeURIComponent(cleanContent)).toString('base64');
  }
  
  const encodedContent = encodeLogContent(content);
  const encodedName = encodeURIComponent(logName);
  
  // 生成編輯器連結 (主頁面) - 讓用戶可以格式化和導出
  let url = \`\${baseUrl}/?data=\${encodedContent}&name=\${encodedName}\`;
  
  if (guildId) {
    url += \`&guild=\${guildId}\`;
  }
  
  return url;
}

// 修改您的 handleHalt 函數
async function handleHalt(source, generateLink) {
  const guildId = source.guild.id;
  const guildData = await getGuildLogData(guildId);
  const logNameToHalt = guildData.currentLogName;

  if (!logNameToHalt) return source.interaction.editReply({ content: '❌ 沒有可以停止的當前日誌。', ephemeral: true });
  
  const logData = await trpgSessionLogCollection.findOne({ guildId, logName: logNameToHalt });
  const finalContent = (logData.content || '') + \`\\n\\n--- 日誌結束於 \${getTimestamp()} ---\`;

  let publicEmbed;
  if (generateLink) {
    // 使用您的實際網站 URL
    const WEBSITE_BASE_URL = 'https://logtrpg.lovable.app'; // 請修改為您的實際網址
    const link = generateRendererLink(WEBSITE_BASE_URL, logNameToHalt, finalContent, guildId);
    
    await trpgSessionLogCollection.updateOne({ guildId, logName: logNameToHalt }, { $set: { content: finalContent, rendererLink: link } });
    publicEmbed = new EmbedBuilder()
      .setColor('Gold')
      .setTitle('🔚 日誌已停止並上傳')
      .setDescription(\`日誌 **\${logNameToHalt}** 已停止記錄並上傳至編輯器。\`)
      .addFields({ name: '📝 編輯器連結', value: \`[✨ 點此格式化並導出日誌](\${link})\` });
  } else {
    await trpgSessionLogCollection.updateOne({ guildId, logName: logNameToHalt }, { $set: { content: finalContent } });
    publicEmbed = new EmbedBuilder().setColor('Orange').setTitle('⏹️ 日誌已停止').setDescription(\`日誌 **\${logNameToHalt}** 已停止記錄。\`);
  }
  
  await trpgLogStateCollection.updateOne({ guildId }, { $set: { currentLogName: null, isLogging: false } });
  guildData.currentLogName = null;
  guildData.isLogging = false;

  await source.channel.send({ embeds: [publicEmbed] });
  await source.interaction.editReply({ content: '指令執行完畢。', ephemeral: true });
}
`;

export default {
  encodeLogContent,
  generateLogEditorUrl,
  generateLogViewerUrl,
  decodeLogContent,
  discordBotIntegrationCode
};