// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.


import Checkbox from "../framework/checkbox.jsx";
import React from "react";
import settings from "../../settings";
import { useTranslation } from 'react-i18next';

const Controls = ({
  onAutoRefreshEnabled,
  handleColorblindModeClick,
  colorBlindMode,
  onAutoRefreshDisabled,
  autoRefreshEnabled,
  voteColors,
}) => {
  const checkboxGroupChanged = (newVal) => {
    if (newVal) {
      onAutoRefreshEnabled();
    } else {
      onAutoRefreshDisabled();
    }
  };
  
  const { t, i18n } = useTranslation();
  
  if (i18n && i18n.language) {
    document.documentElement.lang = i18n.language; //This is too slow for google translate
  }
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
  };

  return (
    <div>
      <button style={{margin: "10px"}} type="button" onClick={() => changeLanguage('fi')}>FI</button>
      <button style={{margin: "10px"}} type="button" onClick={() => changeLanguage('sv')}>SV</button>
      <button style={{margin: "10px"}} type="button" onClick={() => changeLanguage('en')}>EN</button>
      <Checkbox
        label={t('controls.auto_refresh')}
        disabled={false}
        checked={autoRefreshEnabled}
        clickHandler={checkboxGroupChanged}
        labelPosition="left"
        labelWrapperColor={settings.darkerGray}
        color={settings.polisBlue}
      />
      <Checkbox
        label={t('controls.color_blind_mode')}
        disabled={false}
        checked={colorBlindMode}
        clickHandler={handleColorblindModeClick}
        labelPosition="left"
        labelWrapperColor={settings.darkerGray}
        color={settings.polisBlue}
      />
    </div>
  );
};

export default Controls;
