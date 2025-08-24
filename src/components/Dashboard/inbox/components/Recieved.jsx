import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tab, Tabs } from "react-bootstrap";
import DetailedAllRequest from "./DetailedAllRequest";
import DetailedFilteredOut from "./DetailedFilteredOut";
import SidebarFilterSort from "./SidebarFilterSort";
import { useSelector } from "react-redux";
import config from "../../../../config";

function Received({activeKey}) {
  const user = useSelector((state) => state.user.userInfo);
  const [receiverData, setReceiverData] = useState([]);
  const [receiverPreferences, setReceiverPreferences] = useState([]);
  const [prefErrorMessage, setPrefErrorMessage] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("allRequest");
  const [selectedSort, setSelectedSort] = useState("mostRelevant");

  const fetchReceiverData = async () => {
    try {
      const response = await fetch(`${config.baseURL}/api/inbox/receiver/${user.id}`);
      const data = await response.json();
      if (data.success) setReceiverData(data.receivers);
    } catch (error) {
      console.error("Failed to fetch receiver data:", error);
    }
  };

  const fetchPreferenceData = async () => {
    try {
      const response = await axios.get(
        `${config.baseURL}/api/inbox/preference-receiver/${user.id}`,
        {
          params: {
            partner_preference: JSON.stringify(user?.partner_preference || {}),
          },
        }
      );

      if (response.data.success) {
        setReceiverPreferences(response.data.receivers);
        setPrefErrorMessage(null);
      } else {
        setReceiverPreferences([]);
        setPrefErrorMessage(response.data.message || "No preference available");
      }
    } catch (error) {
      console.error("Failed to fetch preference receiver data:", error);
      setReceiverPreferences([]);
      setPrefErrorMessage("Failed to load preference data");
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchReceiverData();
      fetchPreferenceData();
    }
  }, [user, activeKey]);

  const applyFilterAndSort = (data) => {
    let filtered = [...data];

    // Filtering
    if (selectedFilter === "onlineNow") {
      filtered = filtered.filter((item) => item.sender_online);
    } else if (selectedFilter === "withPhotos") {
      filtered = filtered.filter((item) => item.sender_profile_image);
    }

    // Sorting
    if (selectedSort === "newestFirst") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (selectedSort === "olderFirst") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    // "mostRelevant" = default order

    return filtered;
  };

  const filteredReceiverData = applyFilterAndSort(receiverData);
  const filteredReceiverPreferences = applyFilterAndSort(receiverPreferences);

  return (
    <div className="all-request-part">
      <div className="row">
        <div className="col-md-3">
          <SidebarFilterSort
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
              namespace="received"
          />
        </div>

        <div className="col-md-9">
          <div className="tab-container">
            <Tabs defaultActiveKey="detailed" id="profile-tabs" className="nav nav-tabs inbox-tab">
              <Tab eventKey="detailed" title="Detailed All Request">
                <DetailedAllRequest
                  receiverData={filteredReceiverData}
                  fetchReceiverData={fetchReceiverData}
                />
              </Tab>

              {/* {filteredReceiverPreferences.length > 0 && ( */}
                <Tab eventKey="partner" title="Detailed Filtered Out">
                  <DetailedFilteredOut
                    filteredOut={filteredReceiverPreferences}
                    prefErrorMessage={prefErrorMessage}
                  />
                </Tab>
              {/* )} */}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Received;
