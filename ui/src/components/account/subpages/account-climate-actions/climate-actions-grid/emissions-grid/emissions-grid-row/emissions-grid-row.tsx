import React, { FunctionComponent, useEffect, useState } from "react";
import CheckIcon from "../../../../../img/check.png";
import CloseIcon from "../../../../../img/close.png";
import TimeLineIcon from "../../../../../img/timeline.png";
import TimeLineCircle from "../../../../../img/timeline-circle.png";
import { ClimateActionTypes } from "../../../../../../../api/models/DTO/ClimateAction/climate-action-types";
import { ClimateActionVerified } from "../../../../../../../api/models/DTO/ClimateAction/climate-action-verified";
import Moment from "moment";
import IClimateAction from "../../../../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction";
import IEmissions from "../../../../../../../api/models/DTO/ClimateAction/IClimateActions/IEmissions";
import IMitigations from "../../../../../../../api/models/DTO/ClimateAction/IClimateActions/IMitigations";
import "./emissions-grid-row.scss";

interface IProps {
  date?: string;
  timeline?: boolean;
  timelineEndCircle?: boolean;
  climateAction: IClimateAction;
}

const EmissionsGridRow: FunctionComponent<IProps> = (props) => {
  const { climateAction, timeline, timelineEndCircle } = props;

  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<ClimateActionTypes>();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const cType =
      ClimateActionTypes[
        climateAction.credential_type as keyof typeof ClimateActionTypes
      ];
    const amount =
      cType === ClimateActionTypes.Emissions
        ? (climateAction as IEmissions).facility_emissions_co2e
        : (climateAction as IMitigations).facility_mitigations_co2e;

    const verified =
      climateAction.verification_result?.toString() ===
      ClimateActionVerified[ClimateActionVerified.Verified];

    setAmount(amount ?? 0);
    setType(cType);
    setVerified(verified);
  }, [climateAction]);

  return (
    <div className="emission-row">
      {timeline ? (
        <div className="emission-row__timeline">
          <img src={TimeLineIcon} alt="timeline" className="" />
          {timelineEndCircle ? (
            <img
              src={TimeLineCircle}
              alt="timeline"
              className="emission-row__timeline-circle-end"
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      <div className="emission-row__content">
        {timeline ? (
          <div className="emission-row__timeline-date">
            {Moment(climateAction.credential_issue_date).format(
              "HH:mm a DD MMM yyyy"
            )}
          </div>
        ) : (
          ""
        )}

        <div className="emission-row__data">
          <div
            className={`emission-row_small emission-row__emission-amount scope-item-amount ${
              type === ClimateActionTypes.Emissions
                ? "amount-red"
                : "amount-green"
            }`}
          >
            {amount}
          </div>
          <div className="emission-row__title emission-row_small">
            {type === ClimateActionTypes.Emissions
              ? "Emissions"
              : "Mitigations"}{" "}
            <br />
            Mt CO2e/year
          </div>

          <div className="emission-row__scope emission-row_small">
            <button className="emission-row__btn scope-item-btn scope-item-btn_blue">
              {climateAction.climate_action_scope}
            </button>
          </div>
          <div className="emission-row__signed-by emission-row_large">
            <span className="scope-item-signedby-header">Signed By</span>
            <span className="scope-item-signedby">
              {climateAction.signature_name}
            </span>
            {timeline ? (
              ""
            ) : (
              <span className="scope-item-signed-date">
                {Moment(climateAction.credential_issue_date).format(
                  "MMM DD yyyy"
                )}
              </span>
            )}
          </div>

          <div className="emission-row__verified scope-item-verified emission-row_small">
            {verified ? (
              <React.Fragment>
                <img
                  src={CheckIcon}
                  alt="verified"
                  className="scope-verified-icon"
                />
                {climateAction.verification_result} by{" "}
                {climateAction.verification_body}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <img
                  src={CloseIcon}
                  alt="unverified"
                  className="scope-verified-icon"
                />
                {climateAction.verification_result}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmissionsGridRow;
/*
                    <div className="emission-row__description">
                        {climateAction.facility_type}
                    </div>
*/
