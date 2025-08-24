import React from 'react';

const Guidelines = () => (
  <>
    <div className="guideline mt-5">
      <h6 className="mb-3"><strong>Photo guidelines</strong></h6>
      <div className="row photo-guideline text-center mb-4">
        <div className="col"><img src="images/closeup.png" alt="" /><div className="tick">✔ Close up</div></div>
        <div className="col"><img src="images/halfview.png" alt="" /><div className="tick">✔ Half view</div></div>
        <div className="col"><img src="images/fullview.png" alt="" /><div className="tick">✔ Full view</div></div>
        <div className="col"><img src="images/sideface.png" alt="" /><div className="cross">✖ Side face</div></div>
        <div className="col"><img src="images/group.png" alt="" /><div className="cross">✖ Group</div></div>
        <div className="col"><img src="images/blur.png" alt="" /><div className="cross">✖ Unclear</div></div>
      </div>
    </div>

    <div className="row guidelines mt-5">
      <div className="col-md-6">
        <h6 className="text-success">✔ Do's</h6>
        <ul>
          <li>Your photo should be front-facing and your entire face should be visible.</li>
          <li>Ensure your photo is recent and not in a group.</li>
          <li>You can upload up to 20 photos to your profile.</li>
          <li>Each photo must be less than 15 MB and in jpg, gif, png, bmp, or tiff format.</li>
        </ul>
      </div>
      <div className="col-md-6">
        <h6 className="text-danger">✖ Don'ts</h6>
        <ul>
          <li>Watermarked, digitally enhanced or morphed photos will be rejected.</li>
          <li>Photos with personal information will be rejected.</li>
          <li>Irrelevant photos may lead to profile deactivation.</li>
        </ul>
      </div>
    </div>

    <div className="note-box mt-4">
      <strong>Note:</strong> Photos will be screened, optimized, and added to your profile within a few hours.
    </div>
  </>
);

export default Guidelines;
