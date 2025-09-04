import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { scrollToTop } from '../../../utils/helpers';

const PartnerPrefer = ({ isEditing, onEditClick, onSaveClick, onDataChange, updatedData }) => {
    const { userInfo, token } = useSelector(state => state.user);
    const partnerPrefrence = typeof userInfo?.partner_preference ==='object'? userInfo?.partner_preference : JSON.parse(userInfo?.partner_preference)
    
    const getPrefValue = (section, field) => {
        if (updatedData[section] && updatedData[section][field] !== undefined) {
            return updatedData[section][field];
        }
        return partnerPrefrence?.[section]?.[field] || '';
    };

    const handlePrefChange = (section, field, value) => {
        const newSectionData = {
            ...(updatedData[section] || partnerPrefrence[section] || {}),
            [field]: value
        };
        onDataChange(section, newSectionData);
    };

    return (
        <div>
            <div id="partnerPref" className="">
                <div className="section-title partners">Partner Preferences <a onClick={onEditClick} className="small float-end cursor-pointer">
                            Edit
                        </a></div>
                
                {/* Basic Info Section */}
                <div className="section-title">
                    Basic Info
                </div>
                <div className="row py-3 border-top">
                    <div className="col-md-6 pe-md-4">
                        <table className="table table-borderless table-sm mini-data mb-0">
                            <tbody>
                                <tr>
                                    <td>Age:</td>
                                    <td>{partnerPrefrence?.basic?.ageRange}</td>
                                </tr>
                                <tr>
                                    <td>Height:</td>
                                    <td>{partnerPrefrence?.basic?.heightRange}</td>
                                </tr>
                                <tr>
                                    <td>Religion Community:</td>
                                    <td>{partnerPrefrence?.culture?.culture}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="col-md-6 border-start ps-md-4 mt-4 mt-md-0">
                        <table className="table table-borderless table-sm mini-data mb-0">
                            <tbody>
                                <tr>
                                    <td>Language:</td>
                                    <td>{partnerPrefrence?.culture?.language}</td>
                                </tr>
                                <tr>
                                    <td>Marital Status:</td>
                                    <td>{partnerPrefrence?.basic?.maritalStatus}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Location Details Section */}
                <div className="section-title">
                    Location Details
                </div>
                <div className="row py-3 border-top">
                    <div className="col-md-6 pe-md-4">
                        <table className="table table-borderless table-sm mini-data mb-0">
                            <tbody>
                                <tr>
                                    <td>Country Living In:</td>
                                    <td>{partnerPrefrence?.location?.country}</td>
                                </tr>
                                <tr>
                                    <td>State Living In:</td>
                                    <td>{partnerPrefrence?.location?.state}</td>
                                </tr>
                                {/* <tr>
                                    <td>City:</td>
                                    <td>{partnerPrefrence?.location?.city || 'Open to All'}</td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>
                    {/* <div className="col-md-6 border-start ps-md-4 mt-4 mt-md-0"></div> */}
                </div>

                {/* Education Career Section */}
                <div className="section-title">
                    Education Career
                </div>
                <div className="row py-3 border-top">
                    <div className="col-md-6 pe-md-4">
                        <table className="table table-borderless table-sm mini-data mb-0">
                            <tbody>
                                <tr>
                                    <td>Education:</td>
                                    <td>{partnerPrefrence?.education?.qualification}</td>
                                </tr>
                                <tr>
                                    <td>Working With;</td>
                                    <td>{partnerPrefrence?.education?.workingWith}</td>
                                </tr>
                                {/* <tr>
                                    <td>Working Area:</td>
                                    <td>{partnerPrefrence?.education?.workingArea || 'Open to All'}</td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>

                    <div className="col-md-6 border-start ps-md-4 mt-4 mt-md-0">
                        <table className="table table-borderless table-sm mini-data mb-0">
                            <tbody>
                                <tr>
                                    <td>Working As:</td>
                                    <td>{partnerPrefrence?.education?.profession}</td>
                                </tr>
                                <tr>
                                    <td>Annual Income:</td>
                                    <td>{partnerPrefrence?.education?.annualIncome}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Other Details Section */}
                <div className="section-title">
                    Other Details
                </div>

                <div className="row py-3 border-top">
                    <div className="col-md-6 pe-md-4">
                        <table className="table table-borderless table-sm mini-data mb-0">
                            <tbody>
                                <tr>
                                    <td>Profile Managed By:</td>
                                    <td>{partnerPrefrence?.otherDetails?.profileManagedBy}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-6 border-start ps-md-4 mt-4 mt-md-0">
                        <table className="table table-borderless table-sm mini-data mb-0">
                            <tbody>
                                <tr>
                                    <td>Diet:</td>
                                    <td>{partnerPrefrence?.otherDetails?.diet}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="text-end mt-4">
                <button type='button' onClick={scrollToTop} className="btn btn-link back-to-top">
                    Back to Top <i className="fa fa-angle-up" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    )
}

export default PartnerPrefer