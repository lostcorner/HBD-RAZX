<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="text" encoding="UTF-8" />
  <xsl:strip-space elements="*" />

  <xsl:template match="/">
    <xsl:for-each select="//*[contains(concat(' ', normalize-space(@class), ' '), ' pb-comment-item ')]">
      <xsl:variable name="content" select=".//*[contains(concat(' ', normalize-space(@class), ' '), ' comment-content ')][1]" />
      <xsl:text>&#10;=== POST ===&#10;</xsl:text>
      <xsl:text>[AUTHOR] </xsl:text>
      <xsl:value-of select="normalize-space(.//*[contains(concat(' ', normalize-space(@class), ' '), ' head-name ')][1])" />
      <xsl:text>&#10;</xsl:text>
      <xsl:for-each select="$content//*[contains(concat(' ', normalize-space(@class), ' '), ' pb-content-item ')]">
        <xsl:for-each select=".//*[contains(concat(' ', normalize-space(@class), ' '), ' pb-text-wrapper ')]//*[self::span or self::div]/text()">
          <xsl:value-of select="normalize-space(.)" />
          <xsl:text>&#10;</xsl:text>
        </xsl:for-each>
        <xsl:for-each select=".//img[not(contains(@src, 'emoticon'))]">
          <xsl:text>[IMAGE] </xsl:text><xsl:value-of select="@src"/><xsl:text>&#10;</xsl:text>
        </xsl:for-each>
      </xsl:for-each>
      <xsl:for-each select=".//*[contains(concat(' ', normalize-space(@class), ' '), ' image-card-wrapper ')]//img">
        <xsl:text>[IMAGE] </xsl:text><xsl:value-of select="@src"/><xsl:text>&#10;</xsl:text>
      </xsl:for-each>
      <xsl:text>[META] </xsl:text>
      <xsl:value-of select="normalize-space(.//*[contains(concat(' ', normalize-space(@class), ' '), ' pc-pb-comments-desc ')][1])" />
      <xsl:text>&#10;</xsl:text>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
